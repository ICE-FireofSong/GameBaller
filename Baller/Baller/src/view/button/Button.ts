class Button extends egret.Bitmap {
    
    private _doc: egret.DisplayObjectContainer;
  
    constructor(bg: any, doc: egret.DisplayObjectContainer) {
        super(bg);
        this._doc = doc;
    }

    /**
     * 开启按钮事件
     * @param t 回调函数
     */
    public startListener(t: (event) => void) {
        this.touchEnabled = true;
        if (!this.parent) {
            this._doc.addChild(this);
        }
        else { }

        if (!this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, t, this._doc);
        }
    }

    /**
     *关闭按钮事件
     * @param t 回调函数
     */
    public closeListener(t: (event) => void) {
        this.touchEnabled = false;
        if (!this.parent) { }
        else {
            this.parent.removeChild(this);
        }

        if (this.hasEventListener(egret.TouchEvent.TOUCH_TAP)) {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, t, this._doc);
        }
    }




} 