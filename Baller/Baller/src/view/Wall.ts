class Wall {
   
    private _world: p2.World;
    private _body: p2.Body;
    private mirror: egret.DisplayObjectContainer;
    private _color: number;
    private _shape: p2.Rectangle;
    private _width: number;
    private _height: number;
    private _bg: egret.Shape;
    private _name: string;
    /**
     * 是否离开整体序列
     */
    public isLeave: boolean;

    /**
     * 当前墙状态，碰撞前后
     * @param
     */
    public mType: number;
    /**
     * 设置角度
     * @param a 角度
     */    
    set angle(a: number) {
        this._body.angle = a;
        city.phys.P2Space.syncDisplay(this._body);
    }

    get body(): p2.Body {
        return this._body;
    }
    /**
     * 移除墙
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

    set name(str: string) {
        this._name = str;
    }
    /**
     * 名字
     */
    get name(): string {
        return this._name;
    }
    /**
     * y轴值
     */
    get y(): number {
        return this._bg.y;
    }

    constructor(color: number, world: p2.World, w: number, h: number, mirror: egret.DisplayObjectContainer, x, y) {
        this._color = color;
        this.isLeave = false;
        this._world = world;
        this.mirror = mirror;
        this._bg = new egret.Shape();
        this._width = w;
        this._height = h;
        if (color != 0x00ffffff)
            this.createBg(x, y);

        this.createGround(x, y);
        city.phys.P2Space.syncDisplay(this._body);
    }

    private createBg(x, y) {
        this._bg.graphics.clear();
        this._bg.graphics.beginFill(this._color);
        this._bg.graphics.drawRect(0, 0, this._width, this._height);
        this._bg.graphics.endFill();
        this._bg.x = x;
        this._bg.y = y;

    }

    private createGround(x: number, y: number) {
        this._bg.anchorX = this._bg.anchorY = .5;
        this._body = new p2.Body({
            mass: 1
            , position: city.phys.P2Space.getP2Pos(x + this._width / 2, y + this._height / 2)
            , type: p2.Body.KINEMATIC
            , velocity: [0, 0]
        });

        var c: p2.Rectangle = new p2.Rectangle(city.phys.P2Space.extentP2(this._width), city.phys.P2Space.extentP2(this._height));
        this._body.addShape(c);

        if (this._color != 0x00ffffff)
            this._body.displays = [this._bg];
        else
            this._body.displays = [];

        this.mirror.addChildAt(this._bg, 1);
        this._world.addBody(this._body);
    }
    /**
     * 设置碰撞监听
     * @param ball 球对象
     */
    public setBallListener(ball: Ball) {
        this.hitPoint(ball.points);
    }

    private hitPoint(point: Array<Array<number>>): void {
        for (var i = 0; i < point.length; i++) {
            if (this._body.type == p2.Body.DYNAMIC) {
                return;
            }
            else
                if (this._bg.hitTestPoint(point[i][0], point[i][1], true)) {
                    this.isLeave = true;
                    var position = this._body.position;
                    var angle = this._body.angle;
                    var shape = this._body.shapes[0];
                    this._world.removeBody(this._body);
                    this._body = new p2.Body({
                        mass: 1
                        , position: position
                        , type: p2.Body.DYNAMIC
                    });
                    this._body.angle = angle;
                    this._body.addShape(shape);
                    this._body.displays = [this._bg]
                    this._world.addBody(this._body);

                    return;
                }
        }

    }

} 