const ecliptik = require("ecliptik");
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const im = require('imagemagick');

const window = require('svgdom');
const SVG = require('svg.js')(window);
const document = window.document;

function renderToPng(size, vars, response) {
    size = parseInt(size);
    const draw = SVG(document.documentElement);
    draw.size(size, size);
    ecliptik.paint(draw, vars.sex, vars.gender, vars.orientation, vars.sexChange, vars.acceptSexChange, vars.noOrientation);

    let conv = im.convert(["-size", size + "x" + size, 'svg:', 'png:-']);

    conv.stdout.on("data", function (buffer) {
        response.write(buffer, "binary");
    });

    conv.on("end", function (arg) {
        if (arg)
            console.log(arg);
        response.end(null, "binary");
    });

    conv.stdin.write(draw.svg());
    conv.stdin.end();
}

app.get(/^\/([\w-_]+)\/?/, (request, response) => {
    let base64 = request.params[0];
    let download = request.query["download"];
    if( typeof download !== "undefined"){
        response.setHeader('Content-disposition', 'attachment; filename=ecliptik.png');
    }
    response.writeHead(200, {
        "Content-Type": "image/png"
    });
    let size = parseInt(request.query["size"]) || 256;
    size = Math.max(Math.min(size, 1024), 16);
    let param = new ecliptik.Params();
    param.fromUrlParam(base64);
    renderToPng(size, param, response);
});

app.get('/', (request, response) => {
    response.redirect('https://ecliptik.org/');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});

