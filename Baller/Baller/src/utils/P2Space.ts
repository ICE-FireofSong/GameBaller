/**
 * Created by egret on 2015/1/9.
 * author: city@egret-labs.org
 */

module city.phys {

    export class P2Space {
        public static $factor: number;

        private static yAxis = p2.vec2.fromValues(0, 1);
        public static checkIfCanJump(world: p2.World, body: p2.Body): boolean {
            var result = false;
            for (var i = 0; i < world.narrowphase.contactEquations.length; i++) {
                var c = world.narrowphase.contactEquations[i];
                if (c.bodyA === body || c.bodyB === body) {
                    var d = p2.vec2.dot(c.normalA, this.yAxis); // Normal dot Y-axis
                    if (c.bodyA === body) d *= -1;
                    if (d > 0.5) result = true;
                }
            }
            return result;
        }

        public static syncDisplay(body: p2.Body): void {
            var disp: egret.DisplayObject = body.displays[0];
            if (disp) {
                var loc: Array<any> = P2Space.getEgretLoc(body);
                disp.x = loc[0];
                disp.y = loc[1];
                disp.rotation = 360 - body.angle * 180 / Math.PI;
            }
        }

        public static extentEgret(extentP2: number): number {
            return extentP2 * this.$factor;
        }

        public static extentP2(extentEgret: number): number {
            return extentEgret / this.$factor;
        }

        public static getP2Pos(xEgret: number, yEgret: number): Array<number> {
            return [xEgret / this.$factor, (this._rectWorld.height - yEgret) / this.$factor];
        }

        public static getEgretLoc(body: p2.Body): Array<number> {
            //var shp:p2.Shape = body.shapes[0];
            var xP2: number = body.position[0];
            var yP2: number = body.position[1];

            /*switch ( shp.type ){
             case p2.Shape.RECTANGLE:
             xP2 -= (<p2.Rectangle>shp).width / 2;
             yP2 -= (<p2.Rectangle>shp).height / 2;
             break;
             case p2.Shape.CIRCLE:
             xP2 -= (<p2.Circle>shp).radius;
             yP2 -= (<p2.Circle>shp).radius;
             break;
             }*/

            return [xP2 * this.$factor, this._rectWorld.height - yP2 * this.$factor];
        }

        public static initSpace(factor: number, rectWorld: egret.Rectangle): void {
            this.$factor = factor;
            this._rectWorld = rectWorld;
        }

        private static _rectWorld: egret.Rectangle;


        /**
         * debug模式，使用图形绘制
         * from jerry
         */
        public static debug(world: p2.World): void {
            var factor: number = 50;

            var canvas: HTMLCanvasElement = document.createElement("canvas");
            var stage: egret.Stage = egret.MainContext.instance.stage;
            var stageWidth: number = stage.stageWidth;
            var stageHeight: number = stage.stageHeight;
            canvas.width = stageWidth;
            canvas.height = stageHeight;
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "rgba(" + 255 + "," + 255 + "," + 0 + "," + .5 + ")";
            ctx.strokeStyle = "rgba(" + 255 + "," + 0 + "," + 0 + "," + 1 + ")";
            ctx.lineWidth = 1;

            var rendererContext = egret.MainContext.instance.rendererContext;
            var f = rendererContext['onRenderFinish'];
            rendererContext['onRenderFinish'] = function () {
                ctx.clearRect(0, 0, stageWidth, stageHeight);
                var l: number = world.bodies.length;
                for (var i: number = 0; i < l; i++) {
                    var boxBody: p2.Body = world.bodies[i];
                    if (boxBody.sleepState == p2.Body.SLEEPING) {
                        ctx.globalAlpha = 0.5;
                    }
                    else {
                        ctx.globalAlpha = 1;
                    }
                    for (var j: number = 0; j < boxBody.shapes.length; j++) {
                        var boxShape: p2.Shape = boxBody.shapes[j];
                        if (boxShape instanceof p2.Rectangle) {
                            var x: number = (boxBody.position[0] + +boxBody.shapeOffsets[j][0]) * factor;
                            var y: number = stageHeight - (boxBody.position[1] + +boxBody.shapeOffsets[j][1]) * factor;
                            var w: number = (<p2.Rectangle>boxShape).width * factor;
                            var h: number = (<p2.Rectangle>boxShape).height * factor;
                            var matrix: egret.Matrix = egret.Matrix.identity.identity();
                            matrix.prependTransform(x, y, 1, 1, 360 - boxBody.angle * 180 / Math.PI, 0, 0, 0, 0);
                            ctx.save();
                            ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                            ctx.beginPath();
                            ctx.rect(-(<p2.Rectangle>boxShape).width / 2 * factor, -(<p2.Rectangle>boxShape).height / 2 * factor, w, h);
                            ctx.fill();
                            ctx.closePath();
                            ctx.restore();
                        }
                        else if (boxShape instanceof p2.Plane) {
                            ctx.save();
                            ctx.setTransform(1, 0, 0, 1, 0, stageHeight - (boxBody.position[1] + boxBody.shapeOffsets[j][1]) * factor);
                            ctx.beginPath();
                            ctx.moveTo(0, 0);
                            ctx.lineTo(stageWidth, 0);
                            ctx.stroke();
                            ctx.closePath();
                            ctx.restore();
                        }
                        else if (boxShape instanceof p2.Circle) {
                            var x: number = (boxBody.position[0] + boxBody.shapeOffsets[j][0]) * factor;
                            var y: number = stageHeight - (boxBody.position[1] + boxBody.shapeOffsets[j][1]) * factor;
                            var matrix: egret.Matrix = egret.Matrix.identity.identity();
                            matrix.prependTransform(x, y, 1, 1, 360 - boxBody.angle * 180 / Math.PI, 0, 0, 0, 0);
                            ctx.save();
                            ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                            ctx.beginPath();
                            ctx.arc(0, 0,(<p2.Circle>boxShape).radius * factor, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.closePath();
                            ctx.restore();
                        }
                    }
                }
                rendererContext["_cacheCanvasContext"].drawImage(canvas, 0, 0, stageWidth, stageHeight, 0, 0, stageWidth, stageHeight);
                f.call(rendererContext);
            };
        }

    }

}