const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        try {
            executor(this.resolve, this.reject);
        } catch (e) {
            this.reject(e)
        }
    }

    promiseState = PENDING;
    promiseResult = null;

    // 用于保存回调函数
    onResolvedCallbacks = [];
    onRejectedCallbacks = [];

    resolve = value => {
        if (this.promiseState !== PENDING) {
            return;
        }
        this.promiseState = FULFILLED;
        this.promiseResult = value;
        // this.callbacks.onResolved && this.callbacks.onResolved(this.promiseResult);
        while (this.onResolvedCallbacks.length) {
            this.onResolvedCallbacks.shift()();
        }
    };

    reject = reason => {
        if (this.promiseState !== PENDING) {
            return;
        }
        this.promiseState = REJECTED;
        this.promiseResult = reason;
        // this.callbacks.onRejected && this.callbacks.onRejected(this.promiseResult);
        while (this.onRejectedCallbacks.length) {
            this.onRejectedCallbacks.shift()();
        }
    };

    then(onResolved, onRejected) {

        // 参数判断
        onResolved = onResolved && typeof onResolved === 'function' ? onResolved : value => value;
        onRejected = onRejected && typeof onRejected === 'function' ? onRejected : reason => {
            throw reason
        };

        let promise = new MyPromise((resolve, reject) => {
            if (this.promiseState === FULFILLED) {
                setTimeout(() => {
                    try {
                        let res = onResolved(this.promiseResult);
                        resolvePromise(promise, res, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            } else if (this.promiseState === REJECTED) {
                setTimeout(() => {
                    try {
                        let res = onRejected(this.promiseResult);
                        resolvePromise(promise, res, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0);
            } else {
                // 等待状态将成功和失败回调保存
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let res = onResolved(this.promiseResult);
                            resolvePromise(promise, res, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let res = onRejected(this.promiseResult);
                            resolvePromise(promise, res, resolve, reject);
                        } catch (e) {
                            reject(e)
                        }
                    }, 0);
                });
            }
        });

        return promise;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    finally(onFinally) {
        return this.then(value => {
            return MyPromise.resolve(onFinally()).then(() => value)
        }, reason => {
            return MyPromise.resolve(onFinally()).then(() => {throw reason});
        })
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }

    static all(promises) {
        let result = [];
        let index = 0
        return new MyPromise((resolve, reject) => {
            setTimeout(() => {

            }, 0);
            for (let i = 0; i < promises.length; i++) {
                let current = promises[i];
                if (current instanceof MyPromise) {
                    // promise对象
                    current.then(value => {
                        result[i] = value;
                        index++;
                        if (index === promises.length) {
                            resolve(result);
                        }
                    }, reason => {
                        reject(reason);
                    })
                } else {
                    // 普通值
                    result[i] = current;
                    index++;
                    if (index === promises.length) {
                        resolve(result);
                    }
                }
            }
        })
    }

    static race(promises) {
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
}

function resolvePromise(promise, x, resolve, reject) {
    // promise 对象自返回时报错
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>').message);
    }
    if (x instanceof MyPromise) {
        x.then(
            value => {
                resolve(value);
            },
            reason => {
                reject(reason);
            }
        );
    } else {
        resolve(x);
    }
}