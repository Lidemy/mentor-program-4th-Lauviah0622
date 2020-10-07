```js
for(var i=0; i<5; i++) {
  console.log('i: ' + i)
  setTimeout(() => {
    console.log(i)
  }, i * 1000)
}
```




callstack
```
1. anonymous() global       start
2. for loop                 start
3. i = 0
4. console.log('i: ' + i)
5. 
setTimeout(() => {  
    console.log(i)                     
  }, i * 1000)
[webAPI]: [setTimeout(() => { console.log(i) }, 0 * 1000)] //這裡馬上執行完(0 秒)，然後 cb 加入 callback queue
[callback queue]: [() => { console.log(i) }] 

6. i = 0, i < 5
7. i++ => i = 1
8. console.log('i: ' + i)
9. 
setTimeout(() => {  
    console.log(i)                     
  }, i * 1000)
[webAPI]: [setTimeout(() => { console.log(i) }, 1 * 1000)] 
[callback queue]:  [() => { console.log(i) }]

10.  i = 1; i < 5
11. i++; i = 2
12. console.log('i: ' + i)
13. 
setTimeout(() => {  
    console.log(i)                     
  }, i * 1000)
[webAPI]: [
    setTimeout(() => { console.log(i) }, 1 * 1000),
    setTimeout(() => { console.log(i) }, 2 * 1000)
    ] 
[callback queue]: [() => { console.log(i) }]

14. i = 2; i < 5
15. i++; i = 3 
16. console.log('i: ' + i)
17. 
setTimeout(() => {  
    console.log(i)                     
  }, i * 1000)
[webAPI]: [
    setTimeout(() => { console.log(i) }, 1 * 1000),
    setTimeout(() => { console.log(i) }, 2 * 1000)
    setTimeout(() => { console.log(i) }, 3 * 1000)
    ] 
[callback queue]: [() => { console.log(i) }]

18. i = 3; i < 5
19. i++; i = 4
20. console.log('i: ' + i)
21. 
setTimeout(() => {  
    console.log(i)                     
  }, i * 1000)
[webAPI]: [
    setTimeout(() => { console.log(i) }, 1 * 1000),
    setTimeout(() => { console.log(i) }, 2 * 1000),
    setTimeout(() => { console.log(i) }, 3 * 1000),
    setTimeout(() => { console.log(i) }, 4 * 1000)
    ]
[callback queue]: [() => { console.log(i) }]

22. i = 4; i < 5
23. i++; i = 5 
24. i !< 5; for loop         end
25. anonymous() global       end

到這裡，過了比一秒再少一點點的時間
26.
[webAPI]: [
    setTimeout(() => { console.log(i) }, 2 * 1000), 
    setTimeout(() => { console.log(i) }, 3 * 1000), 
    setTimeout(() => { console.log(i) }, 4 * 1000)
    ] 
[callback queue]: [
    () => { console.log(i) },
    () => { console.log(i) }
    ]

過了一秒    
27.
[webAPI]: [
    setTimeout(() => { console.log(i) }, 3 * 1000), 
    setTimeout(() => { console.log(i) }, 4 * 1000)
    ] 
[callback queue]: [
    () => { console.log(i) },
    () => { console.log(i) }, 
    () => { console.log(i) }
    ]

又過了一秒   
28.
[webAPI]: [
    setTimeout(() => { console.log(i) }, 3 * 1000), 
    setTimeout(() => { console.log(i) }, 4 * 1000)
    ] 
[callback queue]: [
    () => { console.log(i) },
    () => { console.log(i) }, 
    () => { console.log(i) } 
    ]

又再過了一秒
29.
[webAPI]: [
    setTimeout(() => { console.log(i) }, 4 * 1000)
    ] 
[callback queue]: [
    () => { console.log(i) },
    () => { console.log(i) }, 
    () => { console.log(i) }, 
    () => { console.log(i) }
    ]

又再過一次一秒
30.
[webAPI]: [] 
[callback queue]: [
    () => { console.log(i) },
    () => { console.log(i) }, 
    () => { console.log(i) }, 
    () => { console.log(i) },
    () => { console.log(i) },
    ]


31. () => { console.log(i) }
32. console.log(5)
33. () => { console.log(i) }
34. console.log(5)
35. () => { console.log(i) }
36. console.log(5)
37. () => { console.log(i) }
38. console.log(5)
39. () => { console.log(i) }
40. console.log(5)
上面連續五次執行 callback queue 裡面的東西

41. anonymous() global       end
終於結束了
```

Execution context change log
```
global_EC {
    VO {
        i: undefined            //1 初始化
        i: 0                    //3
        i: 1                    //10
        i: 2                    //13
        i: 3                    //16
        i: 4                    //19
        i: 5                    //23
    }

    scopechain: [VO]

    end                         //25
}

[From callback queue] () => {console.log(i)} 的 EC，這裡簡稱： 
cb_EC { // 31, 32, 35, 37, 39   
    VO {}

    scopechain: [VO, setTimeout_EC.scopechain]
    = [VO, setTimeout_EC.VO, global_EC.VO]
}

----------------------第二層------------------------
console.log('i: ' + i) EC {     //4, 8, 12, 16, 20
    VO {}
    scopechain: [VO, global_EC.scopechain]
    = [VO, global_EC.VO]

    end                         //4, 8, 12, 16, 20
}

setTimeout_EC {                 //5, 9, 13, 17, 21
    VO {
        anonymous: arrow func 
    }
    
    scopechain: [VO, global_EC.scopechain]
    = [VO, global_EC.VO]

    end                        //5, 9, 13, 17, 21
}

console.log(i) EC {            // 32, 34, 36, 38, 40
    VO {}

    scopechain: [VO, cb_.scopechain]
    = [VO, cb_VO, setTimeout_EC.VO, global_EC.VO]
}

```

❓ 有個部分不太確定，從 callback queue 來的 是在 global 執行完之後再執行，還是 global EC 會執行完之後再執行 Callback queue 


