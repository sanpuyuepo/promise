// Promise rewrite
// 对比原生promise，边思考边写
// ? Promise 静态方法实现及then方法中回调异步实现

const PROMISE_STATE_PENDING = 'pending';
const PROMISE_STATE_FULFILLED = 'fulfilled';
const PROMISE_STATE_REJECTED = 'rejected';

function Promise(executor) {
    //添加属性并初始化
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
        // 3. 调用成功的回调
        // ? 添加异步操作
        setTimeout(() => {
            _this.callbacks.forEach(item => {
                item.onResolved(param)
            })
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
        // 3. 调用失败的回调
        // ? 添加异步操作
        setTimeout(() => {
            _this.callbacks.forEach(item => {
                item.onRejected(param)
            })
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

    // !判断回调函数参数
    if (typeof onRejected !== 'function') {
        onRejected = reason => {
            throw reason;
        }
    }
    if (typeof onResolved !== 'function') {
        onResolved = value => value;
    }

    const _this = this;

    // ! then() 返回新的promise实例
    return new Promise((resolve, reject) => {
        // ? 封装回调函数
        function callback(type) {
            try {
                let res = type(_this.PromiseResult);
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


        // * 执行回调函数
        if (this.PromiseState === PROMISE_STATE_FULFILLED) {
            // ? 添加异步操作
            setTimeout(() => {
                callback(onResolved);
            });
        }
        if (this.PromiseState === PROMISE_STATE_REJECTED) {
            // ? 添加异步操作
            setTimeout(() => {
                callback(onRejected);
            });
        }
        // ! pending 状态，处于异步任务中
        if (this.PromiseState === PROMISE_STATE_PENDING) {
            // * 状态未落定，保存回调函数，待异步任务结束并且状态改变时调用
            this.callbacks.push({
                // *
                onResolved: function () {
                    callback(onResolved);
                },
                onRejected: function () {
                    callback(onRejected)
                },
            });
        }
    });
};
// 2. catch
// * catch 即为 then方法的语法糖
Promise.prototype.catch = function (onRejected) {
    return this.then(null, onRejected);
};

// ? Promise.resolve()
Promise.resolve = function(value) {
    return new Promise((resolve, reject) => {
        if (value instanceof Promise) {
            value.then(v => {
                resolve(v);
            }, r => {
                reject(r);
            })
        } else {
            resolve(value);
        }
    })
}
// ? Promise.reject()
Promise.reject = function(reason) {
    return new Promise((resolve, reject) => {
        reject(reason);
    })
}
// ? Promise.all()
Promise.all = function(promises) {
    return new Promise((resolve, reject) => {
        let counter = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                counter++;
                result[i] = v; // * 不适用push，使用数组下标保证结果顺序和传入的promises顺序一致
                // ! 所有的promises成功才将返回的promise对象改变状态
                if (counter === promises.length) {
                    resolve(result);
                }
            }, r => {
                reject(r);
            })
        }
    })
}

// ? Promise.race() 最先返回结果的promise决定了race方法的返回结果
Promise.race = function(promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(v => {
                resolve(v);
            }, r => {
                reject(r);
            })
        }
    })
}
