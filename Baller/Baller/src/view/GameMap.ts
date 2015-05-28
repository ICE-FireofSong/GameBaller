class GameMap {
    private _doc: egret.DisplayObjectContainer;
    private _walls: Array<Wall>;
    private _world: p2.World;
    private txt: egret.TextField;
    private _sorce: number;
    private _type: string;
    private defaultMap: JSON;
    static TYPE_ONLINE: string = 'online';
    static TYPE_WEB_ERROR: string = 'webError';
    /**
     * 获取当前联网状态
     */
    get webType(): boolean {
        var b = true;
        if (this._type == GameMap.TYPE_WEB_ERROR)
        {
            b = false;
        }
        return b;
    }
    /**
     * 设置当前网络状态
     * @param b true代表在线 false表示网络断开
     */
    set webType(b: boolean) {
        if (b) {
            this._type = GameMap.TYPE_ONLINE;
        } else {
            this._type = GameMap.TYPE_WEB_ERROR;
        }
    }

    /**
     * 获取得分
     */
    get sorce(): number {
        return this._sorce;
    }

    //网络动态加载地图
    private urlreq;
    private urloader: egret.URLLoader;

    /**
     * 在物理世界运动
     * @param ball 球对象
     */
    public runinWorld(ball: Ball) {
        for (var i = 0; i < this._walls.length; i++) {
            city.phys.P2Space.syncDisplay(this._walls[i].body);

            if (this._walls[i].y > this._doc.stage.stageHeight + ball.size * 4) {
                this._walls[i].remove();
                this._walls.splice(i, 1)[0];
                if (this._walls.length > 0)
                    if (this._walls[this._walls.length - 1].y > 0) {
                        this.createMap();
                    }
            }

            if (this._walls[i].mType == 0) {
                this._walls[i].setBallListener(ball)
            }

            if (ball.y < this._doc.stage.stageHeight / 2) {
                if (!this._walls[i].isLeave)
                    this._walls[i].body.velocity = [0, -1];
            }
            else {
                if (!this._walls[i].isLeave)
                    this._walls[i].body.velocity = [0, 0];
            }
        }
    }

    constructor(doc: egret.DisplayObjectContainer, world: p2.World) {
        this._type = GameMap.TYPE_ONLINE;
        this._sorce = -1;
        this._doc = doc;
        this._world = world;
        this._walls = new Array;
        this.init();
    }

 
    private init() {
        this.urloader = new egret.URLLoader();
        this.urlreq = new egret.URLRequest();
        this.defaultMap = RES.getRes('defaultMap');
        this.urlreq.url = "http://localhost:6115/resource/assets/maps.json";
        this.urloader.addEventListener(egret.IOErrorEvent.COMPLETE, this.onComplete, this);
        this.urloader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
        this.txt = new egret.TextField();
        this.txt.textColor = 0xffffffff;
        this.txt.stroke = 5;
        this.txt.strokeColor = 0x0000ff;
        this.txt.text = this._sorce + "";
        this.txt.x = 10;
        this.txt.alpha = 0.5;
        this.txt.y = 20;

        this._doc.addChild(this.txt);
    }

    private clean() {
        this._sorce = -1;
        var arrs = this._walls.splice(0, this._walls.length);
        arrs.forEach((self) => {
            self.remove();
        })

    }

    /**
     * 创建新游戏
     */
    public onCreateGame() {
        this.clean();
        this.txt.text = this._sorce +"";
        var foot = new Wall(0x000000, this._world, this._doc.stage.stageWidth, 40, this._doc, 0, this._doc.stage.stageHeight);
        this._walls.push(foot);
        this.createMap();
        this.createMap();
    }
    
    /**
     * 创建新地图
     */
    public createMap() {
        switch (this._type)
        {
            case GameMap.TYPE_WEB_ERROR:
                this.sorceUp();
                this.loadJsonCreateMap(this.defaultMap);
                break;
            case GameMap.TYPE_ONLINE:
            default:
                this.urloader.load(this.urlreq);
                break;
        }
        
    }

    private sorceUp() {
        this.txt.text = ++this._sorce + "";
    }

    private onError() {
        Main.MAIN_C.removeMenu();
        Main.MAIN_C.showMenu();
        this._type = GameMap.TYPE_WEB_ERROR;
        Main.MAIN_C.menuMessage(Menu.ERROR);
        if (this._walls[this._walls.length - 1].y > 0)
        {
            this.createMap();
        }
    }

    private onComplete() {
        this.sorceUp();
        var str = this.urloader.data;
        var json = JSON.parse(str);
        this.loadJsonCreateMap(json);

    }

    private loadJsonCreateMap(json) {
        var stagesNum = json.stage.length;
        var num: number = Math.floor(Math.random() * stagesNum);

        var objects = json.stage[num].object;
        var y = this._walls[this._walls.length - 1].y;
        for (var i = 0; i < objects.length; i++) {
            this.createRoute(objects[i], y);
        }
    }

    //创建踏板
    private createRoute(data, offY) {
        var color: number;
        switch (data.type) {
            case 0:
                color = 0x790606;
                break;
            case 1:
                color = 0x004080;
                break;
            default:
                color = 0x000000;
                break;
        }

        var wall = new Wall(color, this._world, data.w, data.h, this._doc, data.x, data.y - this._doc.stage.stageHeight + offY);
        wall.mType = data.type;
        wall.angle = data.angle;
        wall.name = data.id;
        this._walls.push(wall);

    }

} 