class Menu {
    private _bg: egret.Shape;
    private mc: MainControal;
    private btns: Array<Button>;
    private _message: egret.TextField;

    /**
     * 是否暂停
     */
    public isStop: boolean;

    static HEY: number = 0;
    static OVER: number = 1;
    static ERROR: number = 2;

    constructor(mc: MainControal) {
        this.btns = new Array;
        this.mc = mc;
        this.create();
        this.isStop = true;
    }

    private create() {
        //创建背景
        this._bg = new egret.Shape();
        this._bg.graphics.beginFill(0x000000);
        this._bg.graphics.drawRect(0, 0, this.mc.doc.stage.stageWidth, this.mc.doc.stage.stageHeight);
        this._bg.graphics.endFill();
        this._bg.alpha = 0.8;

        //创建按钮
        this.btns[0] = new Button(RES.getRes('start'), this.mc.doc);
        this.btns[0].x = 150;

        this.btns[1] = new Button(RES.getRes('restore'), this.mc.doc);
        this.btns[1].x = 150;

        this.btns[2] = new Button(RES.getRes('online'), this.mc.doc);
        this.btns[2].x = 150;

        this.btns[3] = new Button(RES.getRes('offline'), this.mc.doc);
        this.btns[3].x = 150;

        //创建消息
        this._message = new egret.TextField();
        this._message.size = 40;
        this._message.anchorX = .5;
        this._message.textColor = 0xffffff;

    }

    /**
    * Menu.HEY or Menu.OVER
    */
    set message(n: number) {
        switch (n) {
            case 2:
                this._message.text = 'Web Error！'
                break;
            case 1:
                this._message.text = 'Game Over！'
                break;
            case 0:
            default:
                this._message.text = 'Hey Baller！'
                break;
        }
    }

    private start() {
        Main.MAIN_C.removeMenu();
        Main.MAIN_C.newGame();
    }

    private restore() {
        Main.MAIN_C.removeMenu();
    }

    private offLine() {
        Main.MAIN_C.removeMenu();
        Main.MAIN_C.webType = false;
        Main.MAIN_C.showMenu();
    }

    private onLine() {
        Main.MAIN_C.removeMenu();
        Main.MAIN_C.webType = true;
        Main.MAIN_C.showMenu();
    }

    /**
     * 显示菜单
     */
    public showMenu() {
        this.isStop = true;
        this.mc.doc.addChild(this._bg);

        for (var i = 0, y = 100; i < this.btns.length; i++ , y += 100) {
            this.btns[i].y = y;
            switch (i) {
                case 0:
                    this.btns[i].startListener(this.start);
                    break;
                case 1:
                    if (this._message.text == 'Game Over！') {
                        y -= 100;
                    }
                    else {
                        this.btns[i].startListener(this.restore);
                    }
                    break;
                case 2:
                    if (this.mc.webMessage) {
                        this.btns[i].startListener(this.offLine);
                    } else {
                        y -= 100;
                    }
                    break;
                case 3:
                    if (!this.mc.webMessage) {
                        this.btns[i].startListener(this.onLine);
                    } else {
                        y -= 100;
                    }
                    break;
            }

        }

        this._message.x = this.mc.doc.stage.stageWidth / 2 + 20;
        this._message.y = y;
        this.mc.doc.addChild(this._message);
    }

    /**
     * 隐藏菜单
     */
    public removeMenu() {
        this.isStop = false;
        var p = this._bg.parent;
        this.message = Menu.HEY;
        if (!p) { }
        else {
            p.removeChild(this._bg);
        }

        p = this._message.parent;
        if (!p) { }
        else {
            p.removeChild(this._message);
        }

        for (var i = 0; i < this.btns.length; i++) {
            switch (i) {
                case 0:
                    this.btns[i].closeListener(this.start);
                    break;
                case 1:
                    this.btns[i].closeListener(this.restore);
                    break;
                case 2:
                    this.btns[i].closeListener(this.offLine);
                    break;
                case 3:
                    this.btns[i].closeListener(this.onLine);
                    break;
            }
        }

    }


} 