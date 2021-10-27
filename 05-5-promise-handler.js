// 手写promise
class MyPromise {

    constructor(executor) {
        // 添加属性
        this.promiseState = 'pending';
        this.promiseResult = null;

        // 添加一个属性用于保存回调函数
        this.callbacks = [];

        const _this = this;
        // 声明resolve，reject 函数
        function resolve(param) {
            if (_this.promiseState === 'pending') {
                _this.promiseState = 'fulfilled';
                _this.promiseResult = param;

                setTimeout(() => {
                    _this.callbacks.forEach(item => {
                        item.onResolved(param)
                    })
                });
            }
        }

        function reject(param) {
            if (_this.promiseState === 'pending') {
                _this.promiseState = 'rejected';
                _this.promiseResult = param;

                setTimeout(() => {
                    _this.callbacks.forEach(item => {
                        item.onRejected(param)
                    })
                });

            }
        }


        try {
            // executor 内部同步调用
            executor(resolve, reject);
        } catch (e) {
            reject(e)
        }
    }

    // then()
    then(onResolved, onRejected) {
        // 异常穿透：判断回调函数参数
        if (typeof onRejected !== 'function') {
            onRejected = reason => {
                throw reason;
            }
        }
        if (typeof onResolved !== 'function') {
            onResolved = value => value;
        }

        const self = this;

        return new MyPromise((resolve, reject) => {
            // 封装函数
            function callback(type) {
                try {
                    let result = type(self.promiseResult);
                    if (result instanceof MyPromise) {
                        result.then(v => {
                            resolve(v)
                        }, r => {
                            reject(r)
                        })
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(error)
                }
            }

            if (this.promiseState === 'fulfilled') {
                setTimeout(() => {
                    callback(onResolved);
                });

            }

            if (this.promiseState === 'rejected') {
                setTimeout(() => {
                    callback(onRejected);
                });

            }

            if (this.promiseState === 'pending') {
                // 保存回调函数
                this.callbacks.push({
                    onResolved: function () {
                        callback(onResolved)
                    },
                    onRejected: function () {
                        callback(onRejected)
                    }
                })
            }

        })
    }

    // catch()
    catch (onRejected) {
        return this.then(null, onRejected);
    }

    // 静态方法
    // resolve()
    static resolve(value) {
        return new MyPromise((resolve, reject) => {
            if (value instanceof MyPromise) {
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

    // reject()
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        })
    }

    // all()
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let counter = 0;
            let result = [];
            for (let i = 0; i < promises.length; i++) {
                if (promises[i] instanceof MyPromise) {
                    
                }
                promises[i].then(v => {
                    counter++;
                    arr[i] = v;
                    if (counter === promises.length) {
                        resolve(result);
                    }
                }, r => {
                    reject(r);
                })
            }
        })
    }

    // race()
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    resolve(v);
                }, r => {
                    reject(r);
                })
            }
        })
    }

}