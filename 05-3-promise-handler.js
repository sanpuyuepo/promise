// Promise rewrite 
// 对比原生promise，边思考边写
// ? then 方法实现及异步任务回调

const PROMISE_STATE_PENDING = 'pending';
const PROMISE_STATE_FULFILLED = 'fulfilled';
const PROMISE_STATE_REJECTED = 'rejected';

function Promise(executor) {
    //添加属性
    this.PromiseState = PROMISE_STATE_PENDING;
    this.PromiseResult = null;


    // ! 用于异步任务时保存回调函数
    this.callbacks = [];

    // ! 这里要注意this的指向，需要指向实例对象
    const _this = this;
    // * resolve, reject: 改变状态，设置结果值
    function resolve(param) {
        if (_this.PromiseState != PROMISE_STATE_PENDING) {
            return;
        }
        // 1.修改对象状态
        _this.PromiseState = PROMISE_STATE_FULFILLED;
        // 2.修改结果
        _this.PromiseResult = param;
        // ? 3. 调用成功的回调
        _this.callbacks.forEach(item => {
            item.onResolved(param);
        });
    }

    function reject(param) {
        if (_this.PromiseState != PROMISE_STATE_PENDING) {
            return;
        }
        // 1.修改对象状态
        _this.PromiseState = PROMISE_STATE_REJECTED;
        // 2.修改结果
        _this.PromiseResult = param;
        // ? 3. 调用失败的回调
        _this.callbacks.forEach(item => {
            item.onRejected(param);
        });
    }

    // ! 考虑的抛出异常的情况
    try {
        executor(resolve, reject);
    } catch (error) {
        // * 抛出异常时使用reject修改状态
        reject(error)
    }

}
// 添加实例方法: then, catch
// 1.then
Promise.prototype.then = function (onResolved, onRejected) {
    // ! then() 返回新的promise实例
    return new Promise((resolve, reject) => {
        // * 执行回调函数处理成功、失败的情况
        if (this.PromiseState === PROMISE_STATE_FULFILLED) {
            onResolved(this.PromiseResult);
        }
        if (this.PromiseState === PROMISE_STATE_REJECTED) {
            onRejected(this.PromiseResult);
        }
        // ! pending 状态，处于异步任务中
        if (this.PromiseState === PROMISE_STATE_PENDING) {
            // ? 状态未落定，保存回调函数，可能有多个回调，待异步任务结束并且状态改变时调用
            this.callbacks.push({
                onResolved,
                onRejected
            })
        }
    })
}
// 2. catch
Promise.prototype.catch = function () {}