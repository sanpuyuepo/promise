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
