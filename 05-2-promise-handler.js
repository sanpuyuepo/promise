// Promise rewrite 
// 对比原生promise，边思考边写
// ? Promise 构造函数实现

const PROMISE_STATE_PENDING = 'pending';
const PROMISE_STATE_FULFILLED = 'fulfilled';
const PROMISE_STATE_REJECTED = 'rejected';

function Promise(executor) {
    //添加属性
    this.PromiseState = PROMISE_STATE_PENDING;
    this.PromiseResult = null; 
    
    // ! 这里要注意this的指向，需要指向实例对象
    const _this = this;
    // * resolve, reject: 改变状态，设置结果值
    function resolve(param) {
        // 判断状态
        if (_this.PromiseState != PROMISE_STATE_PENDING) {
            return;
        }
        // 1.修改对象状态
        _this.PromiseState = PROMISE_STATE_FULFILLED;
        // 2.修改结果
        _this.PromiseResult = param;
        // todo 调用回调
    }

    function reject(param) {
        if (_this.PromiseState != PROMISE_STATE_PENDING) {
            return;
        }
        // 1.修改对象状态
        _this.PromiseState = PROMISE_STATE_REJECTED;
        // 2.修改结果
        _this.PromiseResult = param;
        // todo 调用回调
    }

    // ! 考虑的抛出异常的情况
    try {
        executor(resolve, reject);    
    } catch (error) {
        // * 抛出异常时使用reject修改状态
        reject(error)
    }
    
}
