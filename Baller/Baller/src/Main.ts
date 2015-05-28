class Main extends egret.DisplayObjectContainer {
    static MAIN_C: MainControal;
    private groupName: string;
    private times: number;
    private url: string;
    private data: {};
    constructor() {
        super();
        this.init();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private init() {
        this.times = 0;
        this.groupName = 'preload';
        this.url = 'resource/'
        this.data = {
            "resources":
            [
                { "name": "start", "type": "image", "url": "assets/start.png" },
                { "name": "restore", "type": "image", "url": "assets/restore.png" },
                { "name": "online", "type": "image", "url": "assets/online.png" },
                { "name": "offline", "type": "image", "url": "assets/offline.png" },
                { "name": "stop", "type": "image", "url": "assets/stop.png" },
                { "name": "defaultMap", "type": "json", "url": "assets/maps.json" }
            ],
            "groups":
            [
                { "name": "preload", "keys": "start,restore,stop,defaultMap,online,offline" }
            ]
        };
    }

    private onAddToStage() {
        RES.parseConfig(this.data, this.url);
        RES.loadGroup(this.groupName);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.success, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.error, this);
   
    }

    private success(e: RES.ResourceEvent) {
        if (e.groupName == this.groupName) {
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.success, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.error, this);
            this.begin();
        }
    }

    private begin() {
        Main.MAIN_C = new MainControal(this);
    }

    private error(e: RES.ResourceEvent) {
        if (this.times++ < 3) {
            RES.loadGroup(this.groupName);
        }
        else {
            alert('Load Error');
        }
    }
} 