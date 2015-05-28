class Ball {
    private _world: p2.World;
    private _body: p2.Body;
    private _bg: egret.Shape;
    private _color: number;
    private mirror: egret.DisplayObjectContainer;
    private _shape: p2.Circle;
    private _size: number;

    /**
     * 弹跳系数
     */
    public tall: number;

    /**
     * 球尺寸
     */
    get size(): number {
        return this._size;
    }
    /**
     * 球x坐标
     */
    get x(): number {
        return this._bg.x;
    }
    /**
     * 球y坐标
     */
    get y(): number {
        return this._bg.y;
    }
    /**
     * 球颜色
     */
    set color(color) {
        this._color = color;
        this.createBg(this.x, this.y);
    }
    /**
     * 球物理实体
     */
    get body(): p2.Body {
        return this._body;
    }
    /**
     * 移除球
     */
    public remove() {
        if (this.body.world != null) {
            this._world.removeBody(this.body);

        }

        if (!this._bg.parent) { }
        else {
            this.mirror.removeChild(this._bg);
        }
    }


    constructor(world: p2.World, mirror: egret.DisplayObjectContainer, x: number, y: number, size: number, color: number) {
        this.tall = 0;
        this._color = color;
        this._world = world;
        this._size = size;
        this._bg = new egret.Shape();
        this.mirror = mirror;
        this.onCreate(x, y);
        city.phys.P2Space.syncDisplay(this._body);
    }

    private createBg(x, y) {
        this._bg.graphics.clear();
        this._bg.graphics.beginFill(this._color);
        this._bg.graphics.drawCircle(0, 0, this._size);
        this._bg.graphics.endFill();
        this._bg.x = x;
        this._bg.y = y;
    }

    private onCreate(x, y) {
        this.createBg(x, y);
        this._body = new p2.Body({
            mass: 1
            , position: city.phys.P2Space.getP2Pos(x + this._size, y + this._size)
        });

        var c: p2.Circle = new p2.Circle(city.phys.P2Space.extentP2(this._size));
        this._body.addShape(c);

        this._body.displays = [this._bg];
        this.mirror.addChildAt(this._bg, 1);
        this._world.addBody(this._body);
    }
    /**
     * 物理世界运动
     */
    public runinWorld() {

        if (this._body.velocity[1] < -5) {
            this._body.velocity[1] = -5;
        }

        if (this.y < this.size )
        {
            this._body.velocity[1] = -5;
        }

        if(this.tall>0)
            if (city.phys.P2Space.checkIfCanJump(this._world, this._body)) {
                this.tall -= 0.1;
                this._body.velocity[1] = this.tall;
            }
        city.phys.P2Space.syncDisplay(this._body);
    }

    /**
     * 获取球坐标用于碰撞检测
     */
    get points(): Array<Array<number>> {
        var x = Math.round(this._bg.x);
        var y = Math.round(this._bg.y);
        var len = Math.round(Math.sqrt(this._size * this._size / 2) + 0.5);

        var arr = new Array;
        for (var i = 0; i < 8; i++) {
            arr[i] = new Array;
            var x0 = x;
            var y0 = y;
            switch (i) {
                case 0:
                    y0 -= this._size;
                    break;
                case 1:
                    x0 += this._size;
                    break;
                case 2:
                    y0 += this._size;
                    break;
                case 3:
                    x0 -= this._size;
                    break;
                case 4:
                    x0 -= len;
                    y0 -= len;
                    break;
                case 5:
                    x0 += len;
                    y0 -= len;
                    break;
                case 6:
                    x0 += len;
                    y0 += len;
                    break;
                case 7:
                    x0 -= len;
                    y0 += len;
                    break;
            }
            arr[i][0] = x0;
            arr[i][1] = y0;
        }
        return arr;
    }



} 