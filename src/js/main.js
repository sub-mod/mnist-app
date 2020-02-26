/* global $ */
class Main {
    constructor() {
        this.canvas = document.getElementById('main');
        this.input = document.getElementById('input');
        this.canvas.width  = 449; // 16 * 28 + 1
        this.canvas.height = 449; // 16 * 28 + 1
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup',   this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.initialize();
    }
    initialize() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, 449, 449);
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, 449, 449);
        this.ctx.lineWidth = 0.05;
        for (var i = 0; i < 27; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo((i + 1) * 16,   0);
            this.ctx.lineTo((i + 1) * 16, 449);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(  0, (i + 1) * 16);
            this.ctx.lineTo(449, (i + 1) * 16);
            this.ctx.closePath();
            this.ctx.stroke();
        }
        this.drawInput();
        $('#output td').text('').removeClass('success');
    }
    onMouseDown(e) {
        this.canvas.style.cursor = 'default';
        this.drawing = true;
        this.prev = this.getPosition(e.clientX, e.clientY);
    }
    onMouseUp() {
        this.drawing = false;
        this.drawInput();
    }
    onMouseMove(e) {
        if (this.drawing) {
            var curr = this.getPosition(e.clientX, e.clientY);
            this.ctx.lineWidth = 32;
            this.ctx.lineCap = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(this.prev.x, this.prev.y);
            this.ctx.lineTo(curr.x, curr.y);
            this.ctx.stroke();
            this.ctx.closePath();
            this.prev = curr;
        }
    }
    getPosition(clientX, clientY) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    drawInput() {
        var ctx = this.input.getContext('2d');
        var img = new Image();
        img.onload = () => {
            /* we need images as 28*28=784 length list */
            var inputs = [];
            var small = document.createElement('canvas').getContext('2d');
            /* Resize the larger Image to 28*28 */
            small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28);
            /* get the pixels of Image. You will get 28*28*4 array */
            /* y axis is towards south. and x axis is towards east */
            var data = small.getImageData(0, 0, 28, 28).data;
            for (var y = 0; y < 28; y++) {
                for (var x = 0; x < 28; x++) {
                    /* location of next pixel subarray */
                    /* https://code.tutsplus.com/tutorials/canvas-from-scratch-pixel-manipulation--net-20573 */
                    var n = 4 * (y * 28 + x);
                    /* convert to grayscale */
                    inputs[y * 28 + x] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
                    ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
                    ctx.fillRect(x * 5, y * 5, 5, 5);
                }
            }
            if (Math.min(...inputs) === 255) {
                return;
            }
            /* normalize the list */
            inputs = inputs.map(v => (255-v)/255.0)
            console.log(JSON.stringify(inputs));
            $.ajax({
                url: '/api/mnist',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(inputs),
                success: (data) => {
                    console.log(JSON.stringify(inputs));
                    for (let i = 0; i < 2; i++) {
                        var max = 0;
                        var max_index = 0;
                        for (let j = 0; j < 10; j++) {
                            var value = Math.round(data.results[i][j] * 1000);
                            if (value > max) {
                                max = value;
                                max_index = j;
                            }
                            var digits = String(value).length;
                            for (var k = 0; k < 3 - digits; k++) {
                                value = '0' + value;
                            }
                            var text = '0.' + value;
                            if (value > 999) {
                                text = '1.000';
                            }
                            $('#output tr').eq(j + 1).find('td').eq(i).text(text);
                        }
                        for (let j = 0; j < 10; j++) {
                            if (j === max_index) {
                                $('#output tr').eq(j + 1).find('td').eq(i).addClass('success');
                            } else {
                                $('#output tr').eq(j + 1).find('td').eq(i).removeClass('success');
                            }
                        }
                    }
                }
            });
        };
        /*Get the Image data from Larger Canvas */
        img.src = this.canvas.toDataURL();
    }
}

$(() => {
    var main = new Main();
    $('#clear').click(() => {
        main.initialize();
    });
});
