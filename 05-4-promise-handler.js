// Promise rewrite
// 对比原生promise，边思考边写
// ? then()链式调用实现

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
        // ?调用成功的回调
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
        // ?调用失败的回调
        _this.callbacks.forEach(item => {
            item.onRejected(param);
        });
    }

    // ! 考虑的抛出异常的情况
    try {
        executor(resolve, reject);
    } catch (error) {
        // * 抛出异常时使用reject修改状态
        reject(error);
    }
}
// 1.then
Promise.prototype.then = function (onResolved, onRejected) {
    const _this = this;
    // ! then() 返回新的promise实例
    return new Promise((resolve, reject) => {
        // * 执行回调函数
        if (this.PromiseState === PROMISE_STATE_FULFILLED) {
            // ! then()方法的链式调用，并用try-catch处理抛出异常的情况
            try {
                let res = onResolved(this.PromiseResult);
                if (res instanceof Promise) {
                    res.then(
                        v => {
                            resolve(v);
                        },
                        r => {
                            reject(r);
                        }
                    );
                } else {
                    resolve(res);
                }
            } catch (error) {
                reject(error);
            }
        }
        if (this.PromiseState === PROMISE_STATE_REJECTED) {
            try {
                let res = onRejected(this.PromiseResult);
                if (res instanceof Promise) {
                    res.then(
                        v => {
                            resolve(v);
                        },
                        r => {
                            reject(r);
                        }
                    );
                } else {
                    resolve(res);
                }
            } catch (e) {
                reject(e);
            }
        }
        // ! pending 状态，处于异步任务中
        if (this.PromiseState === PROMISE_STATE_PENDING) {
            // * 状态未落定，保存回调函数，待异步任务结束并且状态改变时调用
            this.callbacks.push({
                // *
                onResolved: function () {
                    try {
                        let res = onResolved(_this.PromiseResult);
                        if (res instanceof Promise) {
                            res.then(
                                v => {
                                    resolve(v);
                                },
                                r => {
                                    reject(r);
                                }
                            );
                        } else {
                            resolve(res);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onRejected: function () {
                    try {
                        let res = onResolved(_this.PromiseResult);
                        if (res instanceof Promise) {
                            res.then(
                                v => {
                                    resolve(v);
                                },
                                r => {
                                    reject(r);
                                }
                            );
                        } else {
                            resolve(res);
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
            });
        }
    });
};
// 2. catch
Promise.prototype.catch = function () {};
// 3. finally
Promise.prototype.finally = function () {};