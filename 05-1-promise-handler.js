// Promise rewrite 
// 对比原生promise，边思考边写

// 构造函数: 参数为执行器函数:((resolve, reject)) => {}
function Promise(executor) {
    // 同步执行executor
    // 声明resolve，reject
    function resolve(param) {

    }
    function reject(param) {

    }
    executor(resolve, reject);
}

// 添加实例方法: then, catch, finally
// 1.then
Promise.prototype.then = function(onResolved, onRejected) {
     
}
// 2. catch
Promise.prototype.catch = function() {}
// 3. finally
Promise.prototype.finally = function() {}