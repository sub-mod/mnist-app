'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global $ */
var Main = function () {
    function Main() {
        _classCallCheck(this, Main);

        this.canvas = document.getElementById('main');
        this.input = document.getElementById('input');
        this.canvas.width = 449; // 16 * 28 + 1
        this.canvas.height = 449; // 16 * 28 + 1
        this.ctx = this.canvas.getContext('2d');
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.initialize();
    }

    _createClass(Main, [{
        key: 'initialize',
        value: function initialize() {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, 449, 449);
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(0, 0, 449, 449);
            this.ctx.lineWidth = 0.05;
            for (var i = 0; i < 27; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo((i + 1) * 16, 0);
                this.ctx.lineTo((i + 1) * 16, 449);
                this.ctx.closePath();
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(0, (i + 1) * 16);
                this.ctx.lineTo(449, (i + 1) * 16);
                this.ctx.closePath();
                this.ctx.stroke();
            }
            this.drawInput();
            $('#output td').text('').removeClass('success');
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            this.canvas.style.cursor = 'default';
            this.drawing = true;
            this.prev = this.getPosition(e.clientX, e.clientY);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp() {
            this.drawing = false;
            this.drawInput();
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e) {
            if (this.drawing) {
                var curr = this.getPosition(e.clientX, e.clientY);
                this.ctx.lineWidth = 45;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(this.prev.x, this.prev.y);
                this.ctx.lineTo(curr.x, curr.y);
                this.ctx.stroke();
                this.ctx.closePath();
                this.prev = curr;
            }
        }
    }, {
        key: 'getPosition',
        value: function getPosition(clientX, clientY) {
            var rect = this.canvas.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }
    }, {
        key: 'drawInput',
        value: function drawInput() {
            var ctx = this.input.getContext('2d');
            var img = new Image();
            img.onload = function () {
                var inputs = [];
                var small = document.createElement('canvas').getContext('2d');
                small.drawImage(img, 0, 0, img.width, img.height, 0, 0, 28, 28);
                var data = small.getImageData(0, 0, 28, 28).data;
                for (var i = 0; i < 28; i++) {
                    for (var j = 0; j < 28; j++) {
                        var n = 4 * (i * 28 + j);
                        inputs[i * 28 + j] = (data[n + 0] + data[n + 1] + data[n + 2]) / 3;
                        ctx.fillStyle = 'rgb(' + [data[n + 0], data[n + 1], data[n + 2]].join(',') + ')';
                        ctx.fillRect(j * 5, i * 5, 5, 5);
                    }
                }
                if (Math.min.apply(Math, inputs) === 255) {
                    return;
                }
                console.log(JSON.stringify(inputs));
                $.ajax({
                    url: '/api/mnist',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(inputs),
                    success: function success(data) {
                        console.log(JSON.stringify(inputs));
                        for (var _i = 0; _i < 2; _i++) {
                            var max = 0;
                            var max_index = 0;
                            for (var _j = 0; _j < 10; _j++) {
                                var value = Math.round(data.results[_i][_j] * 1000);
                                if (value > max) {
                                    max = value;
                                    max_index = _j;
                                }
                                var digits = String(value).length;
                                for (var k = 0; k < 3 - digits; k++) {
                                    value = '0' + value;
                                }
                                var text = '0.' + value;
                                if (value > 999) {
                                    text = '1.000';
                                }
                                $('#output tr').eq(_j + 1).find('td').eq(_i).text(text);
                            }
                            for (var _j2 = 0; _j2 < 10; _j2++) {
                                if (_j2 === max_index) {
                                    $('#output tr').eq(_j2 + 1).find('td').eq(_i).addClass('success');
                                } else {
                                    $('#output tr').eq(_j2 + 1).find('td').eq(_i).removeClass('success');
                                }
                            }
                        }
                    }
                });
            };
            img.src = this.canvas.toDataURL();
        }
    }]);

    return Main;
}();

$(function () {
    var main = new Main();
    $('#clear').click(function () {
        main.initialize();
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuLyogZ2xvYmFsICQgKi9cbnZhciBNYWluID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE1haW4oKSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBNYWluKTtcblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XG4gICAgICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSA0NDk7IC8vIDE2ICogMjggKyAxXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IDQ0OTsgLy8gMTYgKiAyOCArIDFcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhNYWluLCBbe1xuICAgICAgICBrZXk6ICdpbml0aWFsaXplJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSAnI0ZGRkZGRic7XG4gICAgICAgICAgICB0aGlzLmN0eC5maWxsUmVjdCgwLCAwLCA0NDksIDQ0OSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAxO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlUmVjdCgwLCAwLCA0NDksIDQ0OSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSAwLjA1O1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKChpICsgMSkgKiAxNiwgMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKChpICsgMSkgKiAxNiwgNDQ5KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCAoaSArIDEpICogMTYpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyg0NDksIChpICsgMSkgKiAxNik7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRyYXdJbnB1dCgpO1xuICAgICAgICAgICAgJCgnI291dHB1dCB0ZCcpLnRleHQoJycpLnJlbW92ZUNsYXNzKCdzdWNjZXNzJyk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogJ29uTW91c2VEb3duJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uTW91c2VEb3duKGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnByZXYgPSB0aGlzLmdldFBvc2l0aW9uKGUuY2xpZW50WCwgZS5jbGllbnRZKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnb25Nb3VzZVVwJyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kcmF3SW5wdXQoKTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnb25Nb3VzZU1vdmUnLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gb25Nb3VzZU1vdmUoZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZHJhd2luZykge1xuICAgICAgICAgICAgICAgIHZhciBjdXJyID0gdGhpcy5nZXRQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVdpZHRoID0gMTY7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZUNhcCA9ICdyb3VuZCc7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubW92ZVRvKHRoaXMucHJldi54LCB0aGlzLnByZXYueSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKGN1cnIueCwgY3Vyci55KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnByZXYgPSBjdXJyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6ICdnZXRQb3NpdGlvbicsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRQb3NpdGlvbihjbGllbnRYLCBjbGllbnRZKSB7XG4gICAgICAgICAgICB2YXIgcmVjdCA9IHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiBjbGllbnRYIC0gcmVjdC5sZWZ0LFxuICAgICAgICAgICAgICAgIHk6IGNsaWVudFkgLSByZWN0LnRvcFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiAnZHJhd0lucHV0JyxcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRyYXdJbnB1dCgpIHtcbiAgICAgICAgICAgIHZhciBjdHggPSB0aGlzLmlucHV0LmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dHMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc21hbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAgICAgICAgIHNtYWxsLmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgMjgsIDI4KTtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHNtYWxsLmdldEltYWdlRGF0YSgwLCAwLCAyOCwgMjgpLmRhdGE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyODsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMjg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG4gPSA0ICogKGkgKiAyOCArIGopO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRzW2kgKiAyOCArIGpdID0gKGRhdGFbbiArIDBdICsgZGF0YVtuICsgMV0gKyBkYXRhW24gKyAyXSkgLyAzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoJyArIFtkYXRhW24gKyAwXSwgZGF0YVtuICsgMV0sIGRhdGFbbiArIDJdXS5qb2luKCcsJykgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoaiAqIDUsIGkgKiA1LCA1LCA1KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoTWF0aC5taW4uYXBwbHkoTWF0aCwgaW5wdXRzKSA9PT0gMjU1KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaW5wdXRzKSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9tbmlzdCcsXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShpbnB1dHMpLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGlucHV0cykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IDI7IF9pKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWF4X2luZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfaiA9IDA7IF9qIDwgMTA7IF9qKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gTWF0aC5yb3VuZChkYXRhLnJlc3VsdHNbX2ldW19qXSAqIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF4X2luZGV4ID0gX2o7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpZ2l0cyA9IFN0cmluZyh2YWx1ZSkubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDMgLSBkaWdpdHM7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnMCcgKyB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICcwLicgKyB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID4gOTk5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gJzEuMDAwJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjb3V0cHV0IHRyJykuZXEoX2ogKyAxKS5maW5kKCd0ZCcpLmVxKF9pKS50ZXh0KHRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBfajIgPSAwOyBfajIgPCAxMDsgX2oyKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9qMiA9PT0gbWF4X2luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjb3V0cHV0IHRyJykuZXEoX2oyICsgMSkuZmluZCgndGQnKS5lcShfaSkuYWRkQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNvdXRwdXQgdHInKS5lcShfajIgKyAxKS5maW5kKCd0ZCcpLmVxKF9pKS5yZW1vdmVDbGFzcygnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1nLnNyYyA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIE1haW47XG59KCk7XG5cbiQoZnVuY3Rpb24gKCkge1xuICAgIHZhciBtYWluID0gbmV3IE1haW4oKTtcbiAgICAkKCcjY2xlYXInKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1haW4uaW5pdGlhbGl6ZSgpO1xuICAgIH0pO1xufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=
