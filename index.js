const express = require('express');
const app = express();
const cors=require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    res.write('First chunk hahsahsajsadsjdahahjsdjsjdsdsjdjsjdsjdjsjdsdjsdsds\n');
    setTimeout(() => res.write('Second chunk\n'), 300);
    setTimeout(() => {
        res.write('Final chunk\n');
        res.end();
    }, 500);
});

app.listen(3000, () => {
    console.log('Express server running on port 3000');
});
