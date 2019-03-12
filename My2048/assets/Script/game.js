const ROWS = 4;
const NUMBERS = [2, 4];
const DIRECTION = cc.Enum({
    RIGHT: -1,
    LEFT: -1,
    UP: -1,
    DOWN: -1
});


cc.Class({
    extends: cc.Component,

    properties: {

        blockPrefab: {
            default: null,
            type: cc.Prefab,
        },
        // 获取layout所在Node
        layoutNode: {
            default: null,
            type: cc.Node,
        },
        // 获取 layout 组件
        blockLayout: {
            default: null,
            type: cc.Layout,
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },

        MinLength: 0, // 最小滑动距离
        duration: 0, //数字块滑动时间
    },

    /**
     * @description: 
     * @param {Number}  xDimension:一维数组的长度
     * @param {Number}  yDimension:一维数组中每个元素的长度
     * @return: twoArray 返回一个二维数组
     */
    arrayInit: function (xDimension, yDimension) {
        let blockArr = new Array(); // 先声明一维数组
        for (let i = 0; i < xDimension; i++) {
            blockArr[i] = new Array();
            for (let j = 0; j < yDimension; j++) {
                blockArr[i][j] = 0;
            }
        }
        return blockArr;
    },

    /**
     * @description: 初始游戏方块的生成
     * @param {} 
     * @return: block[] 数组
     */
    blockInit: function () {
        this.blockArr = this.arrayInit(ROWS, ROWS);

        let layoutWidth = this.layoutNode.width;
        let blockGap = this.blockLayout.spacingX;
        this.blockLayout.cellSize.width = (layoutWidth - (ROWS - 1) * blockGap) / ROWS;
        this.blockLayout.cellSize.height = this.blockLayout.cellSize.width;

        // 将预制体资源放入二维数组中
        for (let n = 0; n < ROWS; n++) {
            for (let i = 0; i < ROWS; i++) {
                let block = cc.instantiate(this.blockPrefab);
                this.layoutNode.addChild(block);
                block.getComponent("block").setNumber(0); // 初始化数字 0 时候方块样子 
                this.blockArr[n][i] = block;
            }
        }

    },

    /**
     * @description: 更新数字标签 
     * @param {Number} number:传入更新的数字 
     * @return: null 
     */
    updateScore: function (number) {
        let score = number;
        this.scoreLabel.string = "分数：" + number;
    },

    /**
     * @description: 游戏初始化
     * @param {type} 
     * @return: 
     */
    gameInit: function () {
        this.updateScore(0);
        this.data = this.arrayInit(ROWS, ROWS); // 用来存储每一个游戏块的数值
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                this.blockArr[row][col].getComponent("block").setNumber(0);
                this.data[row][col] = 0;
            }
        }
        // 随机生成数字块 2 or 4 ;
        this.addBlock();
        this.addBlock();
        this.addBlock();
        cc.log(this.blockArr);
        cc.log(this.data);

    },

    /**
     * @description: 随机生成数字块，遍历二维数组，找到数值为 0 的元素，生成 
     * @param {type} 
     * @return: 
     */
    addBlock: function () {
        let locations = this.getEmptyLocations();
        if (locations.length == 0) return false;
        let location = locations[Math.floor(Math.random() * locations.length)];
        this.data[location.x][location.y] = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
        let block = this.blockArr[location.x][location.y].getComponent("block");
        block.setNumber(this.data[location.x][location.y]);
    },

    /**
     * @description: 获取所有块中，数值为 0 的位置 
     * @param {type} 
     * @return: location[]
     */
    getEmptyLocations: function () {
        let locations = [];
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                if (this.data[row][col] == 0) {
                    locations.push({ //  将位置放入数组中
                        x: row,
                        y: col,
                    });
                }
            }
        }
        return locations;
    },

    // 添加触摸监听
    eventHandler: function () {
        this.layoutNode.on("touchstart", (event) => {// 箭头函数中的 this 依旧指向全局的 this
            this.startPoint = event.getLocation();
            //cc.log(this.startPoint);
        })
        this.layoutNode.on("touchend", (event) => {
            this.endPoint = event.getLocation();
            this.reflectTouch();
            //cc.log(this.endPoint);
        })
        this.layoutNode.on("touchcancel", (event) => {
            this.endPoint = event.getLocation();
            this.reflectTouch();
            //cc.log(this.endPoint);
        })
    },

    // 响应触摸事件
    reflectTouch: function () {
        let startVec = this.startPoint;
        let endVec = this.endPoint;
        let pointsVec = endVec.sub(startVec);
        let VecLength = pointsVec.mag(); // 返回向量长度
        if (VecLength > this.MinLength) {
            //cc.log(pointsVec);
            if (Math.abs(pointsVec.x) > Math.abs(pointsVec.y)) {
                // 水平方向响应
                if (pointsVec.x > 0) this.moveBlock(DIRECTION.RIGHT);

                else this.moveBlock(DIRECTION.LEFT);
            }
            else {
                // 垂直方向响应
                if (pointsVec.y > 0) this.moveBlock(DIRECTION.UP);

                else this.moveBlock(DIRECTION.DOWN);
            }
            this.addBlock();
        }

    },

    /**
     * @description: 方块移动方向函数
     * @param {cc.Enum} direction: 方向
     * @return: 
     */
    moveBlock: function (direction) {
        switch (direction) {
            case DIRECTION.RIGHT: {
                cc.log("move right");
                for (let row = 0; row < ROWS; row++) {
                    this.blockMoveRight(row, 0);
                }
                //this.updateBlockNum();
                break;
            }
            case DIRECTION.LEFT: {
                cc.log("move left");
                for (let row = 0; row < ROWS; row++) {
                    this.blockMoveLeft(row, ROWS-1); 
                }
                //cc.log(this.data);
                break;
            }
            case DIRECTION.UP: {
                cc.log("move up");
                for (let col = 0; col < ROWS; col++) {
                    this.blockMoveUp(ROWS-1, col);
                }
                break;
            }
            case DIRECTION.DOWN: {
                cc.log("move down");
                for (let col = 0; col < ROWS; col++) {
                    this.blockMoveDown(0, col);
                }
                break;
            }
        }
    },

    updateBlockNum: function () {
        // 更新方块数字
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < ROWS; col++) {
                this.blockArr[row][col].getComponent("block").setNumber(this.data[row][col]);
            }
        }
    },

    /**
     * @description: 向右移动方块函数
     * @param {Number}  row: 行数
     * @param {Number}  col: 列数
     * @return: 
     */
    blockMoveRight: function (row, col) {
        if (col == ROWS-1) {
            //cc.log("不移动");// test
            return;
        }
        else {
            if (this.data[row][col + 1] == 0) {
                this.data[row][col + 1] = this.data[row][col];
                this.data[row][col] = 0;
                this.blockMoveRight(row, col + 1); // 递归
                this.updateBlockNum();  // 更行方块对应数字颜色
            }
            else {
                if (col < ROWS-1) {
                    if (this.data[row][col] == this.data[row][col + 1]) {
                        this.data[row][col + 1] *= 2;
                        this.data[row][col] = 0;
                    }
                    this.blockMoveRight(row, col + 1);
                    if (this.data[row][col + 1] == 0) {
                        this.data[row][col + 1] = this.data[row][col];
                        this.data[row][col] = 0;
                        this.updateBlockNum();
                    }
                }
            }
        }

    },

    blockMoveLeft: function (row, col) {
        if (col == 0) {
            //cc.log("不移动");// test
            return;
        }
        else {
            if (this.data[row][col - 1] == 0) {
                this.data[row][col - 1] = this.data[row][col];
                this.data[row][col] = 0;
                this.blockMoveLeft(row, col - 1); 
                this.updateBlockNum();  // 更行方块对应数字颜色
            }
            else {
                if (col >0) {
                    if (this.data[row][col] == this.data[row][col - 1]) {
                        this.data[row][col - 1] *= 2;
                        this.data[row][col] = 0;
                    }
                    this.blockMoveLeft(row, col - 1);
                    if (this.data[row][col - 1] == 0) {
                        this.data[row][col - 1] = this.data[row][col];
                        this.data[row][col] = 0;
                        this.updateBlockNum();
                    }
                }
            }
        }

    },

    blockMoveUp: function (row, col) {
        if (row == 0) {
            //cc.log("不移动");// test
            return;
        }
        else {
            if (this.data[row - 1][col] == 0) {
                this.data[row - 1][col] = this.data[row][col];
                this.data[row][col] = 0;
                this.blockMoveUp(row - 1, col); 
                this.updateBlockNum();  // 更行方块对应数字颜色
            }
            else {
                if (row > 0) {
                    if (this.data[row][col] == this.data[row - 1][col]) {
                        this.data[row - 1][col] *= 2;
                        this.data[row][col] = 0;
                    }
                    this.blockMoveUp(row - 1, col);
                    if (this.data[row - 1][col] == 0) {
                        this.data[row - 1][col] = this.data[row][col];
                        this.data[row][col] = 0;
                        this.updateBlockNum();
                    }
                }
            }
        }
    },

    blockMoveDown: function (row, col) {
        if (row == ROWS - 1) {
            //cc.log("不移动");// test
            return;
        }
        else {
            if (this.data[row + 1][col] == 0) {
                this.data[row + 1][col] = this.data[row][col];
                this.data[row][col] = 0;
                this.blockMoveDown(row + 1, col); 
                this.updateBlockNum();  // 更行方块对应数字颜色
            }
            else {
                if (row < ROWS - 1) {
                    if (this.data[row][col] == this.data[row + 1][col]) {
                        this.data[row + 1][col] *= 2;
                        this.data[row][col] = 0;
                    }
                    this.blockMoveDown(row + 1, col);
                    if (this.data[row + 1][col] == 0) {
                        this.data[row + 1][col] = this.data[row][col];
                        this.data[row][col] = 0;
                        this.updateBlockNum();
                    }
                }
            }
        }
    },




    onLoad() {
        this.blockInit();
        this.gameInit();
        this.eventHandler();
        this.count = 0; // 用来记录onLoad调用的次数
        this.count++;
        cc.log("onLoad的执行次数: " + this.count);
    },

    start() {
        //cc.log(this.blockLayout.cellSize.width);
        //cc.log(this.layoutNode.height); //获取节点的高度
        //cc.log(this.layoutNode.width);  //获取节点的宽度
    },

    // update (dt) {},
});
