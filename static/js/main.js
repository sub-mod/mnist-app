"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* global $ */
var Main =
/*#__PURE__*/
function () {
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
    key: "initialize",
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
    key: "onMouseDown",
    value: function onMouseDown(e) {
      this.canvas.style.cursor = 'default';
      this.drawing = true;
      this.prev = this.getPosition(e.clientX, e.clientY);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      this.drawing = false;
      this.drawInput();
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(e) {
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
  }, {
    key: "getPosition",
    value: function getPosition(clientX, clientY) {
      var rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
  }, {
    key: "drawInput",
    value: function drawInput() {
      var ctx = this.input.getContext('2d');
      var img = new Image();

      img.onload = function () {
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

        if (Math.min.apply(Math, _toConsumableArray(inputs)) === 255) {
          return;
        }
        /* normalize the list */


        inputs = inputs.map(function (v) {
          return (255 - v) / 255.0;
        });
        console.log(JSON.stringify(inputs));
        $.ajax({
          url: '/api/mnist',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(inputs),
          success: function success(data) {
            console.log(JSON.stringify(inputs));

            for (var i = 0; i < 2; i++) {
              var max = 0;
              var max_index = 0;

              for (var j = 0; j < 10; j++) {
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

              for (var _j = 0; _j < 10; _j++) {
                if (_j === max_index) {
                  $('#output tr').eq(_j + 1).find('td').eq(i).addClass('success');
                } else {
                  $('#output tr').eq(_j + 1).find('td').eq(i).removeClass('success');
                }
              }
            }
          }
        });
      };
      /*Get the Image data from Larger Canvas */


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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdG9Db25zdW1hYmxlQXJyYXkoYXJyKSB7IHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7IH1cblxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIik7IH1cblxuZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheShpdGVyKSB7IGlmIChTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpIHx8IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChpdGVyKSA9PT0gXCJbb2JqZWN0IEFyZ3VtZW50c11cIikgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7IGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH0gfVxuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbi8qIGdsb2JhbCAkICovXG52YXIgTWFpbiA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1haW4oKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1haW4pO1xuXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IDQ0OTsgLy8gMTYgKiAyOCArIDFcblxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IDQ0OTsgLy8gMTYgKiAyOCArIDFcblxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1haW4sIFt7XG4gICAga2V5OiBcImluaXRpYWxpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJztcbiAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDQ0OSwgNDQ5KTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgICB0aGlzLmN0eC5zdHJva2VSZWN0KDAsIDAsIDQ0OSwgNDQ5KTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDAuMDU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjc7IGkrKykge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKChpICsgMSkgKiAxNiwgMCk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbygoaSArIDEpICogMTYsIDQ0OSk7XG4gICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCAoaSArIDEpICogMTYpO1xuICAgICAgICB0aGlzLmN0eC5saW5lVG8oNDQ5LCAoaSArIDEpICogMTYpO1xuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd0lucHV0KCk7XG4gICAgICAkKCcjb3V0cHV0IHRkJykudGV4dCgnJykucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25Nb3VzZURvd25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgICAgdGhpcy5kcmF3aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJldiA9IHRoaXMuZ2V0UG9zaXRpb24oZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbk1vdXNlVXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xuICAgICAgdGhpcy5kcmF3aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmRyYXdJbnB1dCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbk1vdXNlTW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbk1vdXNlTW92ZShlKSB7XG4gICAgICBpZiAodGhpcy5kcmF3aW5nKSB7XG4gICAgICAgIHZhciBjdXJyID0gdGhpcy5nZXRQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDMyO1xuICAgICAgICB0aGlzLmN0eC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLnByZXYueCwgdGhpcy5wcmV2LnkpO1xuICAgICAgICB0aGlzLmN0eC5saW5lVG8oY3Vyci54LCBjdXJyLnkpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIHRoaXMucHJldiA9IGN1cnI7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFBvc2l0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvc2l0aW9uKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICAgIHZhciByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBjbGllbnRYIC0gcmVjdC5sZWZ0LFxuICAgICAgICB5OiBjbGllbnRZIC0gcmVjdC50b3BcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRyYXdJbnB1dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3SW5wdXQoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5pbnB1dC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvKiB3ZSBuZWVkIGltYWdlcyBhcyAyOCoyOD03ODQgbGVuZ3RoIGxpc3QgKi9cbiAgICAgICAgdmFyIGlucHV0cyA9IFtdO1xuICAgICAgICB2YXIgc21hbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICAvKiBSZXNpemUgdGhlIGxhcmdlciBJbWFnZSB0byAyOCoyOCAqL1xuXG4gICAgICAgIHNtYWxsLmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgMjgsIDI4KTtcbiAgICAgICAgLyogZ2V0IHRoZSBwaXhlbHMgb2YgSW1hZ2UuIFlvdSB3aWxsIGdldCAyOCoyOCo0IGFycmF5ICovXG5cbiAgICAgICAgLyogeSBheGlzIGlzIHRvd2FyZHMgc291dGguIGFuZCB4IGF4aXMgaXMgdG93YXJkcyBlYXN0ICovXG5cbiAgICAgICAgdmFyIGRhdGEgPSBzbWFsbC5nZXRJbWFnZURhdGEoMCwgMCwgMjgsIDI4KS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgMjg7IHkrKykge1xuICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgMjg7IHgrKykge1xuICAgICAgICAgICAgLyogbG9jYXRpb24gb2YgbmV4dCBwaXhlbCBzdWJhcnJheSAqL1xuXG4gICAgICAgICAgICAvKiBodHRwczovL2NvZGUudHV0c3BsdXMuY29tL3R1dG9yaWFscy9jYW52YXMtZnJvbS1zY3JhdGNoLXBpeGVsLW1hbmlwdWxhdGlvbi0tbmV0LTIwNTczICovXG4gICAgICAgICAgICB2YXIgbiA9IDQgKiAoeSAqIDI4ICsgeCk7XG4gICAgICAgICAgICAvKiBjb252ZXJ0IHRvIGdyYXlzY2FsZSAqL1xuXG4gICAgICAgICAgICBpbnB1dHNbeSAqIDI4ICsgeF0gPSAoZGF0YVtuICsgMF0gKyBkYXRhW24gKyAxXSArIGRhdGFbbiArIDJdKSAvIDM7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYignICsgW2RhdGFbbiArIDBdLCBkYXRhW24gKyAxXSwgZGF0YVtuICsgMl1dLmpvaW4oJywnKSArICcpJztcbiAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4ICogNSwgeSAqIDUsIDUsIDUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChNYXRoLm1pbi5hcHBseShNYXRoLCBfdG9Db25zdW1hYmxlQXJyYXkoaW5wdXRzKSkgPT09IDI1NSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvKiBub3JtYWxpemUgdGhlIGxpc3QgKi9cblxuXG4gICAgICAgIGlucHV0cyA9IGlucHV0cy5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICByZXR1cm4gKDI1NSAtIHYpIC8gMjU1LjA7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShpbnB1dHMpKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6ICcvYXBpL21uaXN0JyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGlucHV0cyksXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShpbnB1dHMpKTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHtcbiAgICAgICAgICAgICAgdmFyIG1heCA9IDA7XG4gICAgICAgICAgICAgIHZhciBtYXhfaW5kZXggPSAwO1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IE1hdGgucm91bmQoZGF0YS5yZXN1bHRzW2ldW2pdICogMTAwMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgbWF4X2luZGV4ID0gajtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZGlnaXRzID0gU3RyaW5nKHZhbHVlKS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IDMgLSBkaWdpdHM7IGsrKykge1xuICAgICAgICAgICAgICAgICAgdmFsdWUgPSAnMCcgKyB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9ICcwLicgKyB2YWx1ZTtcblxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+IDk5OSkge1xuICAgICAgICAgICAgICAgICAgdGV4dCA9ICcxLjAwMCc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCgnI291dHB1dCB0cicpLmVxKGogKyAxKS5maW5kKCd0ZCcpLmVxKGkpLnRleHQodGV4dCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmb3IgKHZhciBfaiA9IDA7IF9qIDwgMTA7IF9qKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoX2ogPT09IG1heF9pbmRleCkge1xuICAgICAgICAgICAgICAgICAgJCgnI291dHB1dCB0cicpLmVxKF9qICsgMSkuZmluZCgndGQnKS5lcShpKS5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkKCcjb3V0cHV0IHRyJykuZXEoX2ogKyAxKS5maW5kKCd0ZCcpLmVxKGkpLnJlbW92ZUNsYXNzKCdzdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICAvKkdldCB0aGUgSW1hZ2UgZGF0YSBmcm9tIExhcmdlciBDYW52YXMgKi9cblxuXG4gICAgICBpbWcuc3JjID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIE1haW47XG59KCk7XG5cbiQoZnVuY3Rpb24gKCkge1xuICB2YXIgbWFpbiA9IG5ldyBNYWluKCk7XG4gICQoJyNjbGVhcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICBtYWluLmluaXRpYWxpemUoKTtcbiAgfSk7XG59KTsiXSwiZmlsZSI6Im1haW4uanMifQ==
