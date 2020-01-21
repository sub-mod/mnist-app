"use strict";

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbi8qIGdsb2JhbCAkICovXG52YXIgTWFpbiA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1haW4oKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIE1haW4pO1xuXG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICAgIHRoaXMuaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQnKTtcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IDQ0OTsgLy8gMTYgKiAyOCArIDFcblxuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IDQ0OTsgLy8gMTYgKiAyOCArIDFcblxuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLm9uTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcC5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE1haW4sIFt7XG4gICAga2V5OiBcImluaXRpYWxpemVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9ICcjRkZGRkZGJztcbiAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIDQ0OSwgNDQ5KTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgICB0aGlzLmN0eC5zdHJva2VSZWN0KDAsIDAsIDQ0OSwgNDQ5KTtcbiAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDAuMDU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjc7IGkrKykge1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKChpICsgMSkgKiAxNiwgMCk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVUbygoaSArIDEpICogMTYsIDQ0OSk7XG4gICAgICAgIHRoaXMuY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbygwLCAoaSArIDEpICogMTYpO1xuICAgICAgICB0aGlzLmN0eC5saW5lVG8oNDQ5LCAoaSArIDEpICogMTYpO1xuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZHJhd0lucHV0KCk7XG4gICAgICAkKCcjb3V0cHV0IHRkJykudGV4dCgnJykucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwib25Nb3VzZURvd25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xuICAgICAgdGhpcy5kcmF3aW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMucHJldiA9IHRoaXMuZ2V0UG9zaXRpb24oZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbk1vdXNlVXBcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xuICAgICAgdGhpcy5kcmF3aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmRyYXdJbnB1dCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJvbk1vdXNlTW92ZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbk1vdXNlTW92ZShlKSB7XG4gICAgICBpZiAodGhpcy5kcmF3aW5nKSB7XG4gICAgICAgIHZhciBjdXJyID0gdGhpcy5nZXRQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IDMyO1xuICAgICAgICB0aGlzLmN0eC5saW5lQ2FwID0gJ3JvdW5kJztcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyh0aGlzLnByZXYueCwgdGhpcy5wcmV2LnkpO1xuICAgICAgICB0aGlzLmN0eC5saW5lVG8oY3Vyci54LCBjdXJyLnkpO1xuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIHRoaXMucHJldiA9IGN1cnI7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdldFBvc2l0aW9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFBvc2l0aW9uKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICAgIHZhciByZWN0ID0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB4OiBjbGllbnRYIC0gcmVjdC5sZWZ0LFxuICAgICAgICB5OiBjbGllbnRZIC0gcmVjdC50b3BcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImRyYXdJbnB1dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkcmF3SW5wdXQoKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5pbnB1dC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5wdXRzID0gW107XG4gICAgICAgIHZhciBzbWFsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHNtYWxsLmRyYXdJbWFnZShpbWcsIDAsIDAsIGltZy53aWR0aCwgaW1nLmhlaWdodCwgMCwgMCwgMjgsIDI4KTtcbiAgICAgICAgdmFyIGRhdGEgPSBzbWFsbC5nZXRJbWFnZURhdGEoMCwgMCwgMjgsIDI4KS5kYXRhO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjg7IGkrKykge1xuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgMjg7IGorKykge1xuICAgICAgICAgICAgdmFyIG4gPSA0ICogKGkgKiAyOCArIGopO1xuICAgICAgICAgICAgaW5wdXRzW2kgKiAyOCArIGpdID0gKGRhdGFbbiArIDBdICsgZGF0YVtuICsgMV0gKyBkYXRhW24gKyAyXSkgLyAzO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2IoJyArIFtkYXRhW24gKyAwXSwgZGF0YVtuICsgMV0sIGRhdGFbbiArIDJdXS5qb2luKCcsJykgKyAnKSc7XG4gICAgICAgICAgICBjdHguZmlsbFJlY3QoaiAqIDUsIGkgKiA1LCA1LCA1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTWF0aC5taW4uYXBwbHkoTWF0aCwgaW5wdXRzKSA9PT0gMjU1KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaW5wdXRzKSk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgdXJsOiAnL2FwaS9tbmlzdCcsXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShpbnB1dHMpLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoaW5wdXRzKSk7XG5cbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCAyOyBfaSsrKSB7XG4gICAgICAgICAgICAgIHZhciBtYXggPSAwO1xuICAgICAgICAgICAgICB2YXIgbWF4X2luZGV4ID0gMDtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBfaiA9IDA7IF9qIDwgMTA7IF9qKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBNYXRoLnJvdW5kKGRhdGEucmVzdWx0c1tfaV1bX2pdICogMTAwMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgIG1heCA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgbWF4X2luZGV4ID0gX2o7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRpZ2l0cyA9IFN0cmluZyh2YWx1ZSkubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCAzIC0gZGlnaXRzOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgIHZhbHVlID0gJzAnICsgdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAnMC4nICsgdmFsdWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPiA5OTkpIHtcbiAgICAgICAgICAgICAgICAgIHRleHQgPSAnMS4wMDAnO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoJyNvdXRwdXQgdHInKS5lcShfaiArIDEpLmZpbmQoJ3RkJykuZXEoX2kpLnRleHQodGV4dCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBmb3IgKHZhciBfajIgPSAwOyBfajIgPCAxMDsgX2oyKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoX2oyID09PSBtYXhfaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICQoJyNvdXRwdXQgdHInKS5lcShfajIgKyAxKS5maW5kKCd0ZCcpLmVxKF9pKS5hZGRDbGFzcygnc3VjY2VzcycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAkKCcjb3V0cHV0IHRyJykuZXEoX2oyICsgMSkuZmluZCgndGQnKS5lcShfaSkucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgaW1nLnNyYyA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBNYWluO1xufSgpO1xuXG4kKGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1haW4gPSBuZXcgTWFpbigpO1xuICAkKCcjY2xlYXInKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgbWFpbi5pbml0aWFsaXplKCk7XG4gIH0pO1xufSk7Il0sImZpbGUiOiJtYWluLmpzIn0=
