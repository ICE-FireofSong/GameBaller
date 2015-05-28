class MainControal {
    //主框架
    private _doc: egret.DisplayObjectContainer;
    get doc(): egret.DisplayObjectContainer {
        return this._doc;
    }
    //球对象
    private _ball: Ball;
    //地图对象
    private _map: GameMap;
    //菜单
    private _menu: Menu;
    //物理世界
    private _world: p2.World;
    //事件场景
    private bodys: Array<p2.Body>;
    /**
     * 获取当前网络连接状态
     * true代表在线 false代表断连
     */
    get webMessage(): boolean {
        return this._map.webType;
    }
    /**
     * 设置网络连接状态
     * @param b true代表在线 false代表断连
     */
    set webType(b: boolean)
    {
        this._map.webType = b;
    }

    /**
     * 隐藏菜单
     */
    public removeMenu() {
        this._doc.touchEnabled = true;
        this._menu.removeMenu();
        this._doc.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchProcess, this, false);
    }

    /**
     * 显示菜单
     */
    public showMenu() {
        this._doc.touchEnabled = false;
        this._doc.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchProcess, this, false);
        this._menu.showMenu();
    }
    /**
     * 创建新的游戏
     */
    public newGame() {

        this._map.onCreateGame();
        var ballSize = 10;
        var ballColor = 0x000000;
        this.newPlayer(this.doc.stage.stageWidth / 2, this.doc.stage.stageHeight - ballSize * 10, ballSize, ballColor);
    }

    /**
     * 传递菜单消息
     */
    public menuMessage(msg: number)
    {
        this._menu.message = msg;
    }


    constructor(doc: egret.DisplayObjectContainer) {
        this.bodys = new Array;
        this._doc = doc;
        this._menu = new Menu(this);
        this._menu.message = Menu.HEY;
        this.onCreate();
        this.showMenu();
        egret.Ticker.getInstance().register(this.worldRun, this);
    }
    /**
     * 对球的控制方法
     * @param e 触碰事件
     */
    private touchProcess(e: egret.TouchEvent) {
        if (this._menu.isStop || e.stageY < this._ball.size * 5) {
            return;
        }

        if (e.stageY < this._ball.y) {
            if (city.phys.P2Space.checkIfCanJump(this._world, this._ball.body)) {
                this._ball.body.velocity[1] = 9;
                this._ball.tall = 9;
            }
        } else {
            this._ball.tall = 0;
        }

        if (e.stageX >= this._ball.x) {
            this._ball.body.velocity[0] = 3;
        }
        else {
            this._ball.body.velocity[0] = -3;
        }
    }

    //初始化
    private onCreate() {
        this.createWorld();
    }

    /**
     * 世界开始运动
     * @param dt 时间
     */
    private worldRun(dt: number) {
        if (this._menu.isStop) {
            return;
        }

        this.bodys.forEach((self) => {
            city.phys.P2Space.syncDisplay(self);
        })

        if (this._ball.y > this._doc.stage.stageHeight + this._ball.size * 3) {
            this._menu.message = Menu.OVER;
            this.showMenu();
            return;
        }

        this._world.step(dt/350);
        this._ball.runinWorld();
        this._map.runinWorld(this._ball);

    }

    /**
     * 暂停
     * @param e 触碰事件
     */
    private stop(e: egret.TouchEvent) {
        if (!this._menu.isStop) {
            this.showMenu();
        }
    }

    //创建世界
    private createWorld() {
        //创建背景
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.beginFill(0xffffff);
        bg.graphics.drawRect(0, 0, this.doc.stage.stageWidth, this.doc.stage.stageHeight);
        bg.graphics.endFill();
        this.doc.addChild(bg);

        //暂停按钮
        var stop = new egret.Bitmap(RES.getRes('stop'));
        stop.width = 40;
        stop.height = 40;
        stop.x = 440;
        stop.y = 10;
        this.doc.addChild(stop);
        stop.touchEnabled = true;
        stop.addEventListener(egret.TouchEvent.TOUCH_TAP, this.stop, this);
         
        //创建物理世界
        city.phys.P2Space.initSpace(50, new egret.Rectangle(0, 0, this.doc.stage.stageWidth, this.doc.stage.stageHeight));
        this._world = new p2.World();

        var walleft = new Wall(0x00ffffff, this._world, 100, this.doc.stage.stageHeight, this.doc, -100, 0);
        var walRight = new Wall(0x00ffffff, this._world, 100, this.doc.stage.stageHeight, this.doc, this.doc.stage.stageWidth, 0);

        this.bodys.push(walleft.body);
        this.bodys.push(walRight.body);

        var ballSize = 10;
        var ballColor = 0x000000;
        this.newPlayer(this.doc.stage.stageWidth / 2, this.doc.stage.stageHeight - ballSize * 10, ballSize, ballColor);

        //创建地图
        this._map = new GameMap(this.doc, this._world);
        this._map.onCreateGame();

    }

    /**
     * 建立新的球
     * @param x x坐标
     * @param y y坐标
     * @param ballSize 球半径
     * @param ballColor 球颜色
     */
    private newPlayer(x: number, y: number, ballSize: number, ballColor: number) {

        if (!this._ball) { }
        else {
            this._ball.remove();
        }
        //创建球
        this._ball = new Ball(this._world, this.doc, x, y, ballSize, ballColor);
    }

}