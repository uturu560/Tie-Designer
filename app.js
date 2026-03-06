(function () {
  'use strict';

  const state = {
    color: '#0f0f0f',
    patternColor: '#c9a227',
    pattern: 'solid',
    patternOnHead: false,
    patternOrientation: 'vertical',
    showCollar: true,
    includeCollarInDownload: true
  };

  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 520;

  var TIE_GEOM = {
    cx: 200,
    knotH: 22,
    h0: 26,
    h1: 318,
    h2: 72,
    knotWTop: 24,
    knotWBottom: 34,
    w0: 34,
    w1: 58,
    w2: 88,
    yKnot0: 48,
    yKnot1: 48 + 22,
    y0: 48 + 22,
    y1: 48 + 22 + 26,
    y2: 48 + 22 + 26 + 318,
    y3: 48 + 22 + 26 + 318 + 72
  };
  TIE_GEOM.yKnot1 = TIE_GEOM.yKnot0 + TIE_GEOM.knotH;
  TIE_GEOM.y0 = TIE_GEOM.yKnot1;
  TIE_GEOM.y1 = TIE_GEOM.y0 + TIE_GEOM.h0;
  TIE_GEOM.y2 = TIE_GEOM.y1 + TIE_GEOM.h1;
  TIE_GEOM.y3 = TIE_GEOM.y2 + TIE_GEOM.h2;

  function createPatternCanvas(name, baseColor, patternColor) {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = patternColor;

    function drawStripes(orientation, spacing) {
      spacing = spacing || 8;
      ctx.save();
      if (orientation === 'horizontal') {
        ctx.rotate(-Math.PI / 2);
        ctx.translate(-size, 0);
        for (let i = 0; i < size * 2; i += spacing) {
          ctx.fillRect(i, 0, spacing / 2, size * 2);
        }
      } else if (orientation === 'diagonalUpRight') {
        ctx.translate(0, size);
        ctx.rotate(-Math.PI / 4);
        for (let i = -size; i < size * 2; i += spacing) {
          ctx.fillRect(i, 0, spacing / 2, size * 2);
        }
      } else if (orientation === 'diagonalDownRight') {
        ctx.translate(0, 0);
        ctx.rotate(Math.PI / 4);
        for (let i = -size; i < size * 2; i += spacing) {
          ctx.fillRect(i, 0, spacing / 2, size * 2);
        }
      } else {
        for (let i = 0; i < size; i += spacing) {
          ctx.fillRect(i, 0, spacing / 2, size);
        }
      }
      ctx.restore();
    }

    var orient = state.patternOrientation || 'vertical';

    switch (name) {
      case 'stripes':
        drawStripes(orient);
        break;
      case 'dots':
        for (let y = 0; y < size; y += 12) {
          for (let x = 0; x < size; x += 12) {
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
      case 'diagonal':
        drawStripes(orient, 10);
        break;
      case 'check': {
        const sq = size / 4;
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 4; col++) {
            if ((row + col) % 2 === 0) {
              ctx.fillRect(col * sq, row * sq, sq, sq);
            }
          }
        }
        break;
      }
      default:
        break;
    }

    return canvas;
  }

  function drawTie(drawCollar) {
    if (drawCollar === undefined) drawCollar = state.showCollar;

    const canvas = document.getElementById('tieCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var g = TIE_GEOM;
    var cx = g.cx;

    var solidFill = state.color;
    var patternFill = state.color;
    if (state.pattern !== 'solid') {
      var patternCanvas = createPatternCanvas(state.pattern, state.color, state.patternColor);
      patternFill = ctx.createPattern(patternCanvas, 'repeat');
    }
    var headFill = state.patternOnHead ? patternFill : solidFill;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(cx - g.knotWTop / 2, g.yKnot0);
    ctx.lineTo(cx + g.knotWTop / 2, g.yKnot0);
    ctx.lineTo(cx + g.knotWBottom / 2, g.yKnot1);
    ctx.lineTo(cx - g.knotWBottom / 2, g.yKnot1);
    ctx.closePath();
    ctx.fillStyle = headFill;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - g.w0 / 2, g.y0);
    ctx.lineTo(cx + g.w0 / 2, g.y0);
    ctx.lineTo(cx + g.w1 / 2, g.y1);
    ctx.lineTo(cx - g.w1 / 2, g.y1);
    ctx.closePath();
    ctx.fillStyle = headFill;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - g.w1 / 2, g.y1);
    ctx.lineTo(cx + g.w1 / 2, g.y1);
    ctx.lineTo(cx + g.w2 / 2, g.y2);
    ctx.lineTo(cx - g.w2 / 2, g.y2);
    ctx.closePath();
    ctx.fillStyle = patternFill;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - g.w2 / 2, g.y2);
    ctx.lineTo(cx + g.w2 / 2, g.y2);
    ctx.lineTo(cx, g.y3);
    ctx.closePath();
    ctx.fillStyle = patternFill;
    ctx.fill();

    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - g.knotWTop / 2, g.yKnot0);
    ctx.lineTo(cx + g.knotWTop / 2, g.yKnot0);
    ctx.lineTo(cx + g.knotWBottom / 2, g.yKnot1);
    ctx.lineTo(cx + g.w0 / 2, g.y0);
    ctx.lineTo(cx + g.w1 / 2, g.y1);
    ctx.lineTo(cx + g.w2 / 2, g.y2);
    ctx.lineTo(cx, g.y3);
    ctx.lineTo(cx - g.w2 / 2, g.y2);
    ctx.lineTo(cx - g.w1 / 2, g.y1);
    ctx.lineTo(cx - g.w0 / 2, g.y0);
    ctx.lineTo(cx - g.knotWBottom / 2, g.yKnot1);
    ctx.closePath();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.restore();

    if (drawCollar) {
      var neckY = g.yKnot0 - 14;
      var topOuterX = 70;
      var topInnerX = 6;
      var vX = 18;
      var vY = g.yKnot1 + 10;
      var sharpY = g.yKnot1 + 46;
      var sharpOutX = 78;
      var outerCurveCtrlX = 95;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 5;

      var collarGrad = ctx.createLinearGradient(cx, neckY - 12, cx, sharpY + 10);
      collarGrad.addColorStop(0, '#ffffff');
      collarGrad.addColorStop(0.4, '#f8f8f8');
      collarGrad.addColorStop(0.6, '#f2f2f2');
      collarGrad.addColorStop(1, '#fafafa');
      ctx.fillStyle = collarGrad;
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(cx - sharpOutX, sharpY);
      ctx.quadraticCurveTo(cx - outerCurveCtrlX, (neckY + 10 + sharpY) / 2, cx - topOuterX, neckY + 10);
      ctx.quadraticCurveTo(cx, neckY - 8, cx - topInnerX, neckY + 8);
      ctx.lineTo(cx - vX, vY);
      ctx.lineTo(cx - sharpOutX, sharpY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + sharpOutX, sharpY);
      ctx.quadraticCurveTo(cx + outerCurveCtrlX, (neckY + 10 + sharpY) / 2, cx + topOuterX, neckY + 10);
      ctx.quadraticCurveTo(cx, neckY - 8, cx + topInnerX, neckY + 8);
      ctx.lineTo(cx + vX, vY);
      ctx.lineTo(cx + sharpOutX, sharpY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = 'rgba(0,0,0,0.07)';
      ctx.beginPath();
      ctx.moveTo(cx - vX, vY);
      ctx.lineTo(cx + vX, vY);
      ctx.stroke();
      ctx.restore();
    }
  }

  function syncColorInputs() {
    var colorEl = document.getElementById('color');
    var hexEl = document.getElementById('colorHex');
    if (colorEl) colorEl.value = state.color;
    if (hexEl) hexEl.value = state.color;
  }

  function syncPatternColorInputs() {
    var colorEl = document.getElementById('patternColor');
    var hexEl = document.getElementById('patternColorHex');
    if (colorEl) colorEl.value = state.patternColor;
    if (hexEl) hexEl.value = state.patternColor;
  }

  function attachListeners() {
    var color = document.getElementById('color');
    var colorHex = document.getElementById('colorHex');
    var pattern = document.getElementById('pattern');
    var patternColor = document.getElementById('patternColor');
    var patternColorHex = document.getElementById('patternColorHex');
    var download = document.getElementById('download');
    var saveConfig = document.getElementById('saveConfig');

    if (color) {
      color.addEventListener('input', function () {
        state.color = this.value;
        if (colorHex) colorHex.value = state.color;
        drawTie();
      });
      color.addEventListener('change', function () {
        state.color = this.value;
        if (colorHex) colorHex.value = state.color;
        drawTie();
      });
    }
    if (colorHex) {
      colorHex.addEventListener('input', function () {
        if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
          state.color = this.value;
          if (color) color.value = state.color;
          drawTie();
        }
      });
    }

    if (pattern) {
      pattern.addEventListener('change', function () {
        state.pattern = this.value;
        drawTie();
      });
    }

    if (patternColor) {
      patternColor.addEventListener('input', function () {
        state.patternColor = this.value;
        if (patternColorHex) patternColorHex.value = state.patternColor;
        drawTie();
      });
      patternColor.addEventListener('change', function () {
        state.patternColor = this.value;
        if (patternColorHex) patternColorHex.value = state.patternColor;
        drawTie();
      });
    }
    if (patternColorHex) {
      patternColorHex.addEventListener('input', function () {
        if (/^#[0-9A-Fa-f]{6}$/.test(this.value)) {
          state.patternColor = this.value;
          if (patternColor) patternColor.value = state.patternColor;
          drawTie();
        }
      });
    }

    var patternOrientation = document.getElementById('patternOrientation');
    var patternOnHead = document.getElementById('patternOnHead');
    if (patternOrientation) {
      patternOrientation.addEventListener('change', function () {
        state.patternOrientation = this.value;
        drawTie();
      });
    }
    if (patternOnHead) {
      patternOnHead.addEventListener('change', function () {
        state.patternOnHead = this.checked;
        drawTie();
      });
    }

    var showCollar = document.getElementById('showCollar');
    var includeCollarInDownload = document.getElementById('includeCollarInDownload');
    if (showCollar) {
      showCollar.addEventListener('change', function () {
        state.showCollar = this.checked;
        drawTie();
      });
    }
    if (includeCollarInDownload) {
      includeCollarInDownload.addEventListener('change', function () {
        state.includeCollarInDownload = this.checked;
      });
    }

    if (download) {
      download.addEventListener('click', function () {
        var canvas = document.getElementById('tieCanvas');
        if (!canvas) return;
        drawTie(state.includeCollarInDownload);
        var dataUrl = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = state.includeCollarInDownload ? 'tie-with-collar.png' : 'tie-only.png';
        a.click();
        drawTie();
      });
    }

    if (saveConfig) {
      saveConfig.addEventListener('click', function () {
        var config = {
          color: state.color,
          patternColor: state.patternColor,
          pattern: state.pattern,
          patternOnHead: state.patternOnHead,
          patternOrientation: state.patternOrientation,
          showCollar: state.showCollar,
          includeCollarInDownload: state.includeCollarInDownload
        };
        var blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'tie-design.json';
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    var goalSection = document.getElementById('goalSection');
    var goalNumber = document.getElementById('goalNumber');
    var goalTarget = 150000;
    var goalDuration = 5000;
    var goalAnimationId = null;

    function formatGoal(n) {
      return n.toLocaleString('en-GB', { useGrouping: true }).replace(/,/g, ' ');
    }

    function runGoalCountUp() {
      if (goalAnimationId !== null) cancelAnimationFrame(goalAnimationId);
      var start = null;
      function step(timestamp) {
        if (!start) start = timestamp;
        var elapsed = timestamp - start;
        var t = Math.min(elapsed / goalDuration, 1);
        var eased = t * (2 - t);
        var value = Math.round(eased * goalTarget);
        if (goalNumber) goalNumber.textContent = formatGoal(value);
        if (t < 1) goalAnimationId = requestAnimationFrame(step);
        else goalAnimationId = null;
      }
      if (goalNumber) goalNumber.textContent = formatGoal(0);
      goalAnimationId = requestAnimationFrame(step);
    }

    function resetGoalNumber() {
      if (goalAnimationId !== null) {
        cancelAnimationFrame(goalAnimationId);
        goalAnimationId = null;
      }
      if (goalNumber) goalNumber.textContent = formatGoal(0);
    }

    if (goalSection) {
      goalSection.addEventListener('mouseenter', runGoalCountUp);
      goalSection.addEventListener('mouseleave', resetGoalNumber);
    }
  }

  function init() {
    syncColorInputs();
    syncPatternColorInputs();
    drawTie();
    attachListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
