define(['./textures'], function(textures) {
  var canvas = null;
  var context = null;

  // TODO: maybe make this a stateless static class and pass a context around directly?
  return {
    init: function(canvas_, callback) {
      canvas = canvas_;
      context = canvas.getContext('2d');

      // preload all the textures
      textures.load(context, callback);
    },

    clear: function(style) {
      context.save();
      context.fillStyle = style;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    },

    // TODO: fix this API, it's pretty hacky
    // I'd really like to have:
    // - drawMesh(mesh, transform, material)
    drawMesh: function(mesh, fillStyle) {
      context.save();
    
      if (mesh.translate && mesh.translate.length > 1) {
        context.translate.apply(context, mesh.translate);
      }

      if (mesh.scale && mesh.scale.length > 1) {
        context.scale(mesh.scale[0], mesh.scale[1]);
      }
      else if (typeof mesh.scale === 'number') {
        context.scale(mesh.scale, mesh.scale);
      }

      context.beginPath();
      
      if (mesh.path && mesh.path.length > 0) {
        context.moveTo(mesh.path[0][0], mesh.path[0][1]);
        
        for (var i = 1; i < mesh.path.length; i++) {
          context.lineTo(mesh.path[i][0], mesh.path[i][1]);
        }
      }

      context.closePath();

      if (mesh.type == 'fill') {
        context.fillStyle = fillStyle || mesh.style;
        context.fill();
      } else {
        context.strokeStyle = 'white';
        context.stroke();
      }

      context.restore();
    },

    drawCircle: function(x, y, r, style) {
      context.save();
      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = style;
      context.fill();
      context.restore();
    },

    outlineCircle: function(x, y, r, style, width) {
      width = width || 1;
      context.save();
      context.beginPath();
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.closePath();
      context.strokeStyle = style;
      context.lineWidth = width;
      context.stroke();
      context.restore();
    },

    fillBox: function(l, t, r, b, style) {
      context.save();
      context.fillStyle = style;
      context.fillRect(l, t, r - l, b - t);
      context.restore();
    },

    outlineBox: function(l, t, r, b, style) {
      context.save();
      context.beginPath();
      context.rect(l, t, r - l, b - t);
      context.closePath();
      context.strokeStyle = style;
      context.lineWidth = 2;
      context.stroke();
      context.restore();
    },

    withContext: function(callback) {
      context.save();
      callback(context);
      context.restore();
    },

    width: function() { return canvas.width; },
    height: function() { return canvas.height; },

    context: function() {
      return context;
    }
  };
});
