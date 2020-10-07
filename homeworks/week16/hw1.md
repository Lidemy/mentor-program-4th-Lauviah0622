```js
                        // 0 start
console.log(1)          // 1 start, 1 end
setTimeout(() => {      // 2 start, webAPI_counter_1 start, 2 end
  console.log(2)        // 6 
}, 0)
console.log(3)          // 3 start, 3 end
setTimeout(() => {      // 4 start, webAPI_counter_2 start, end
  console.log(4)        // 7
}, 0)
console.log(5)          // 5 start, 5 end
```

```
==callstack==
1.  anonymous() global start   
2.  console.log(1) start
3.  console.log(1) end
4.  setTimeout(() => { console.log(2) }, 0) start        //[webApi]:           setTimeout(() => { console.log(2) })
5.  setTimeout(() => { console.log(2) }, 0) end          //[callback queue]:   [() => { console.log(2) }]
6.  console.log(3) start
7.  console.log(3) end
8.  setTimeout(() => { console.log(4) }, 0) start        //[webApi]:           setTimeout(() => { console.log(2) })
9.  setTimeout(() => { console.log(4) }, 0) end          //[callback queue]:   [() => { console.log(2) }, () => { console.log(4) }]
10. console.log(5) start                                    
11. console.log(5) end
12. anonymous() global end

13. [From callback queue] () => { console.log(2) } start //[callback queue]:   [() => { console.log(4) }]
14. console.log(2) start
15. console.log(2) end
16. [From callback queue] () => { console.log(2) } end
17. [From callback queue] () => { console.log(4) } start //[callback queue]:   []
18. console.log(4) start
19. console.log(4) end
20. [From callback queue] () => { console.log(4) } end
```

```
=== console===
1. 
2. 1
3. 
4. 
5. 
6. 3
7. 
8. 
9. 
10. 5
11. 
12. 

13. 
14. 2
15. 
16. 
17. 
18. 4
19. 
20.
```

