import { getToken, setToken } from "./utils";
const baseURL = "https://student-json-api.lidemy.me/";

const getPosts = () => {
  return fetch(baseURL + "posts?_sort=createdAt&_order=desc").then((res) =>
    res.json()
  );
};

const getPost = (id) => {
  return fetch(baseURL + "posts?id=" + id).then((res) => res.json());
};

const login = (username, password) => {
  return fetch(baseURL + "login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      setToken(json.token);
      return json;
    });
};

const getMe = () => {
  const token = getToken();
  if (!token) return Promise.reject({ ok: 0, message: "no token" });
  return fetch(baseURL + "me", {
    headers: {
      authorization: "Bearer " + token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
};

const register = (nickname, username, password) => {
  return fetch(baseURL + "register", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      nickname,
      username,
      password,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      localStorage.setItem("token", json.token);
      return json;
    });
};

const createPost = async (title, body) => {
  try {
    const token = getToken();
    if (!token) return Error("no token");
    
    let postResponse = await fetch(baseURL + "posts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        title,
        body,
      }),
    });
    const postData = await postResponse.json();
    return postData
  } catch (err) {
    console.log(err);
    // 想問說通常錯誤處理會怎麼處理？送到 catch Err 之後應該不會只是 print 出來？
  }
};

const deletePost = async (id, callback) => {
  try {
    const token = getToken();
    if (!token) return Error("no token");
    
    await fetch(baseURL + "posts/" + id, {
      method: "DELETE",
      headers: {
        authorization: 'Bearer ' + token,
      },
    });
    callback()
  } catch (err) {
    console.log(err);
  }
}

const deletePosts = (start, end) => {
  let counter = start;
  
  const callback = () => {
    counter += 1;
    if (counter > end) return 
    deletePost(counter, callback);
  }
  deletePost(start, callback)
} 
// 刪掉測試加上去的壞東西

export { getPosts, getPost, login, getMe, register, createPost, deletePosts };
