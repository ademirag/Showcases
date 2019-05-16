String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

var http = require("http");
var https = require("https");

const { parse } = require("url");
const next = require("next");
const dev = process.env.NODE_ENV !== "productio";
const app = next({ dev });

for (var k in app) {
  console.log(k);
}

const handle = app.getRequestHandler();

var posts = null;
var postsArr = null;

var monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık"
];

var fs = require("fs");

var todayListDate = null;
var todayLists = {};
var admin = require("firebase-admin");

var serviceAccount = require("./inciligastronomi2018-firebase-adminsdk-rmqtw-01993e1a2f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inciligastronomi2018.firebaseio.com"
});

function parseURL(url) {
  let baseInfo = url.split("?");
  if (baseInfo.length == 1) return {};
  let arr = baseInfo[1].split("&");
  let rv = {};
  for (var i = 0; i < arr.length; i++) {
    let info = arr[i].split("=");
    rv[info[0]] = decodeURIComponent(info[1]);
  }
  return rv;
}

function serverLogic(req, res) {
  // Be sure to pass `true` as the second argument to `url.parse`.
  // This tells it to parse the query portion of the URL.
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;
  // if (pathname === '/test') {
  //   app.render(req, res, '/', {test:"abcabc",title:"TEST PAGE"})
  // } else {
  //   app.render(req, res, '/',{title:"HOME"})
  // }
  if (
    pathname.indexOf("/static/") !== -1 ||
    pathname.indexOf("/_next/") !== -1
  ) {
    app.render(req, res, pathname);
    return;
  }

  if ("/robots.txt" === pathname) {
    if (!res.writable) return;
    res.writable = false;
    res.write("User-agent: *\nAllow: /");
    res.end();
    return;
  }

  if ("/sitemap.xml" === pathname) {
    fetchPageMapList(function(pages) {
      fetchRestoranMapList(function(restorans) {
        if (!res.writable) return;
        res.writable = false;
        res.write(getSiteMapXML(pages, restorans));
        res.end();
      });
    });
    return;
  }

  if ("/favicon.ico" === pathname) {
    if (!res.writable) return;
    res.writable = false;
    res.end();
    return;
  }

  checkLists(function() {
    if (pathname === "/") {
      renderHome(req, res);
    } else if (pathname === "/admin-blog-flush-cache") {
      const params = parseURL(req.url);
      if (params.p === "Defahqun38WW") {
        posts = null;
        postsArr = null;
      }
      res.end();
    } else if (pathname === "/admin-restoran-flush-lists") {
      const params = parseURL(req.url);
      if (params.p === "Defahqun38WW") {
        todayListDate = null;
      }
      res.end();
    } else if (pathname === "/admin-list-flush-cache") {
      const params = parseURL(req.url);
      if (params.p === "Defahqun38WW") {
        todayListDate = null;
      }
      res.end();
    } else if (pathname === "/blog" || pathname === "/blog/") {
      renderBlog(req, res, "/");
    } else if (pathname.indexOf("/blog/arsiv/") != -1) {
      renderBlog(req, res, pathname);
    } else if (pathname === "/arama" || pathname === "/arama/") {
      renderSearchResult(req, res);
    } else if (
      pathname === "/yeni-acilanlar" ||
      pathname === "/yeni-acilanlar/"
    ) {
      renderNewRestorans(req, res);
    } else if (
      pathname.indexOf("/blog/kategori/") != -1 ||
      pathname.indexOf("/blog/yazar/") != -1
    ) {
      renderBlog(req, res, pathname);
    } else if (pathname.indexOf("/blog/") != -1) {
      renderBlogContent(req, res, pathname);
    } else if (pathname.indexOf("/sayfa/") != -1) {
      renderPageContent(req, res, pathname);
    } else if (pathname.indexOf("/restoran/") != -1) {
      renderRestoran(req, res, pathname);
    } else if (pathname.indexOf("/liste/") != -1) {
      renderListContent(req, res, pathname);
    } else if (pathname === "/emojiset" || pathname === "/emojiset/") {
      const params = parseURL(req.url);
      setEmoji(params.s, Number(params.e));
      res.end();
    } else if (pathname === "/more/" || pathname === "/more") {
      const params = parseURL(req.url);
      switch (params.w) {
        case "liste":
          fetchList(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(JSON.stringify({ data: state.listItems }));
              res.end();
            },
            req,
            res,
            JSON.parse(params.q),
            Number(params.i)
          );
          break;
        case "blog":
          var altPostArr = categoriezBlogPosts(JSON.parse(params.q).pathname);
          fetchBlogHomePosts(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(JSON.stringify({ data: state.blogHomePosts }));
              res.end();
            },
            req,
            res,
            Number(params.i),
            altPostArr
          );
          break;
        case "incili-2":
          fetchIncili(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(
                JSON.stringify({ data: state["incili-2"], key: "incili-2" })
              );
              res.end();
            },
            req,
            res,
            "-2",
            params.i
          );
          break;
        case "incili4":
          fetchIncili(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(
                JSON.stringify({ data: state.incili4, key: "incili4" })
              );
              res.end();
            },
            req,
            res,
            4,
            params.i
          );
          break;
        case "incili3":
          fetchIncili(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(
                JSON.stringify({ data: state.incili3, key: "incili3" })
              );
              res.end();
            },
            req,
            res,
            3,
            params.i
          );
          break;
        case "incili2":
          fetchIncili(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(
                JSON.stringify({ data: state.incili2, key: "incili2" })
              );
              res.end();
            },
            req,
            res,
            2,
            params.i
          );
          break;
        case "incili1":
          fetchIncili(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(
                JSON.stringify({ data: state.incili1, key: "incili1" })
              );
              res.end();
            },
            req,
            res,
            1,
            params.i
          );
          break;
        case "lezzet":
          fetchLezzetPosts(
            {},
            function(req, res, state) {
              if (!res.writable) return;
              res.writable = false;
              res.write(JSON.stringify({ data: state.lezzet }));
              res.end();
            },
            req,
            res,
            params.i,
            params.c
          );
          break;
      }
    } else {
      render404(req, res);
    }
  });
}

var ssl_options = {
  key: fs.readFileSync("./ssl/privatekey.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
  ca: fs.readFileSync("./ssl/chain.pem")
};

app
  .prepare()
  .then(() => {
    http.createServer(serverLogic).listen(80, err => {
      if (err) throw err;
      console.log("> Listening 80");
    });

    https.createServer(ssl_options, serverLogic).listen(443, err => {
      if (err) throw err;
      console.log("> Listenin 443");
    });

    console.log("Listening on port 80...");
  })
  .catch(error => {
    console.log("NEXT APP ERROR: ", error);
  });

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});

function renderHome(req, res) {
  var state = createState([
    "lezzet",
    "latestPost",
    "blogHomePosts",
    "vitrin",
    "incili5",
    "incili4",
    "incili3",
    "incili2",
    "incili1"
  ]);
  fetchLatestPost(state, onHomeStateReady, req, res);
  fetchBlogHomePosts(state, onHomeStateReady, req, res, 0);
  fetchLezzetPosts(state, onHomeStateReady, req, res, 0, 5);
  fetchVitrin(state, onHomeStateReady, req, res);
  fetchIncili(state, onHomeStateReady, req, res, 5);
  fetchIncili(state, onHomeStateReady, req, res, 4);
  fetchIncili(state, onHomeStateReady, req, res, 3);
  fetchIncili(state, onHomeStateReady, req, res, 2);
  fetchIncili(state, onHomeStateReady, req, res, 1);
}

function onHomeStateReady(req, res, state) {
  app.render(req, res, "/", { ...state });
}

function categoriezBlogPosts(pathname) {
  var altPostArr = null;
  const paths = pathname.split("/");
  for (var i = 0; i < paths.length; i++) {
    if (
      paths[i].toLowerCase() === "arsiv" &&
      !isNaN(Number(paths[i + 2])) &&
      Number(paths[i + 2]) > 0 &&
      Number(paths[i + 2]) <= 12
    ) {
      altPostArr = [];
      var startTimestamp = new Date(
        paths[i + 1] + "-" + Number(paths[i + 2]) + "-" + 1
      ).getTime();
      var endTimestamp = new Date(
        paths[i + 1] +
          "-" +
          Number(paths[i + 2]) +
          "-" +
          new Date(paths[i + 1], Number(paths[i + 2]), 0).getDate()
      ).getTime();
      for (var i = 0; i < postsArr.length; i++) {
        if (
          postsArr[i].date >= startTimestamp &&
          postsArr[i].date <= endTimestamp
        ) {
          altPostArr.push(postsArr[i]);
        }
      }
      break;
    } else if (paths[i].toLowerCase() === "yazar") {
      altPostArr = [];
      for (var i = 0; i < postsArr.length; i++) {
        if (postsArr[i].tags.indexOf("Müge A") !== -1) {
          altPostArr.push(postsArr[i]);
        }
      }
    }
  }
  return altPostArr;
}

function renderBlog(req, res, pathname) {
  //cachePosts(function(){
  var state = createState([
    "lezzet",
    "tags",
    "latestPost",
    "blogHomePosts",
    "archivesNavigation",
    "popularPosts",
    "relatedLists",
    "similarRestoran"
  ]);

  state.blogTitle = "BLOG YAZISI";
  var altPostArr = categoriezBlogPosts(pathname);
  const paths = pathname.split("/");
  for (var i = 0; i < paths.length; i++) {
    if (paths[i].toLowerCase() === "kategori") {
      state.blogTitle = paths[i + 1].toUpperCase();
      break;
    } else if (
      paths[i].toLowerCase() === "arsiv" &&
      !isNaN(Number(paths[i + 2])) &&
      Number(paths[i + 2]) > 0 &&
      Number(paths[i + 2]) <= 12
    ) {
      state.blogTitle =
        "ARŞİV: " +
        paths[i + 1].toUpperCase() +
        " " +
        monthNames[Number(paths[i + 2]) - 1].toUpperCase();
      break;
    } else if (paths[i].toLowerCase() === "yazar") {
      state.blogTitle = "YAZAR: Müge Akgün";
    }
  }
  state.queryInfo = { pathname: pathname };
  fetchLatestPost(state, onBlogStateReady, req, res, altPostArr);
  fetchBlogHomePosts(state, onBlogStateReady, req, res, 0, altPostArr);
  fetchLezzetPosts(state, onBlogStateReady, req, res, 0, 5);
  fetchArchivesNav(state, onBlogStateReady, req, res);
  fetchPopularPosts(state, onBlogStateReady, req, res);
  fetchRelatedLists(state, onBlogStateReady, req, res);
  fetchSimilarRestoran(state, onBlogStateReady, req, res);
  fetchTags(state, onBlogStateReady, req, res);
  //});
}

function onBlogStateReady(req, res, state) {
  app.render(req, res, "/", {
    ...state,
    title: "İncili Gastronomi Rehberi - Blog",
    section: "blog"
  });
}

function renderSearchResult(req, res) {
  var q = parseURL(req.url);
  var state = createState([
    "result",
    "blogHomePosts",
    "relatedLists",
    "lezzet"
  ]);

  fetchLezzetPosts(state, onSearchResultStateReady, req, res, 0, 5);
  fetchBlogHomePosts(state, onSearchResultStateReady, req, res, 0);
  fetchRelatedLists(state, onSearchResultStateReady, req, res);

  if (q.q) {
    q = q.q;
    searchName(q, function(data) {
      if (data && data.length > 0) state.result = data;
      else state.result = 0;
      checkStateCompleteness(state, onSearchResultStateReady, req, res);
    });
  } else {
    state.result = 0;
    checkStateCompleteness(state, onSearchResultStateReady, req, res);
  }
}

function onSearchResultStateReady(req, res, state) {
  app.render(req, res, "/", {
    ...state,
    title: "Restoran Arama Sonucu - İncili Gastronomi Rehberi",
    section: "search-result"
  });
}

function render404(req, res) {
  var q = parseURL(req.url);
  var state = createState(["blogHomePosts", "relatedLists", "lezzet"]);

  fetchLezzetPosts(state, on404StateReady, req, res, 0, 5);
  fetchBlogHomePosts(state, on404StateReady, req, res, 0);
  fetchRelatedLists(state, on404StateReady, req, res);
}

function on404StateReady(req, res, state) {
  app.render(req, res, "/", {
    ...state,
    section: "Sayfa Bulunamadı - 404 - İncili Gastronomi Rehberi",
    title: "HOME"
  });
}

function renderListContent(req, res, pathname) {
  const pathInfo = pathname.split("/");
  const mutfak = pathInfo[2];
  const city = pathInfo[3];
  const inci = pathInfo[4];
  const price = pathInfo[5];

  const queryInfo = {
    mutfak: getMutfakFromSlug(mutfak),
    city: getCityFromSlug(city),
    inci: getInciFromSlug(inci),
    price: getPriceFromSlug(price)
  };
  const index = 0;

  var state = createState(["listItems", "blogHomePosts", "lezzet"]);

  state.pathname = pathname;

  if (!mutfak || !city || !inci || !price) {
    state.listItems = 404;
  } else {
    state.inci = queryInfo.inci == -1 ? "" : queryInfo.inci;
    state.caption =
      (mutfakFromIndex(queryInfo.mutfak)
        ? mutfakFromIndex(queryInfo.mutfak) + ", "
        : "") +
      cityFromIndex(queryInfo.city) +
      (cityFromIndex(queryInfo.city) && tl(queryInfo.price)
        ? " - " + tl(queryInfo.price)
        : "");
    state.queryInfo = queryInfo;
    fetchList(state, onListStateReady, req, res, queryInfo, 0);
  }
  fetchLezzetPosts(state, onListStateReady, req, res, 0, 5);
  fetchBlogHomePosts(state, onListStateReady, req, res, 0);
}

function onListStateReady(req, res, state) {
  if (state.listItems === 404) {
    render404(req, res);
  } else {
    app.render(req, res, "/", {
      ...state,
      title:
        (state.inci !== "" ? state.inci + " İncili " : "") +
        state.caption +
        " Listesi - İncili Gastronomi Rehberi",
      section: "list"
    });
  }
}

function renderNewRestorans(req, res) {
  var state = createState(["incili-2", "blogHomePosts", "lezzet"]);
  fetchIncili(state, onNewRestStateReady, req, res, "-2");
  fetchLezzetPosts(state, onNewRestStateReady, req, res, 0, 5);
  fetchBlogHomePosts(state, onNewRestStateReady, req, res, 0);
}

function onNewRestStateReady(req, res, state) {
  app.render(req, res, "/", {
    ...state,
    title: "Yeni Açılan Restoranlar - İncili Gastronomi Rehberi",
    section: "new-list"
  });
}

function renderBlogContent(req, res, pathname) {
  const pathInfo = pathname.split("/");
  const contentURL = pathInfo[2];

  var state = createState([
    "lezzet",
    "tags",
    "archivesNavigation",
    "similarPosts",
    "relatedLists",
    "thePost",
    "similarRestoran"
  ]);
  fetchLezzetPosts(state, onBlogContentStateReady, req, res, 0, 5);
  fetchArchivesNav(state, onBlogContentStateReady, req, res);
  fetchSimilarPosts(state, onBlogContentStateReady, req, res, contentURL);
  fetchRelatedLists(state, onBlogContentStateReady, req, res);
  fetchBlogContent(state, onBlogContentStateReady, req, res, contentURL);
  fetchSimilarRestoran(state, onBlogContentStateReady, req, res);
  fetchTags(state, onBlogContentStateReady, req, res);
}

function onBlogContentStateReady(req, res, state) {
  app.render(req, res, "/", { ...state, section: "blog-content" });
}

function renderPageContent(req, res, pathname) {
  const pathInfo = pathname.split("/");
  const contentURL = pathInfo[2];

  var state = createState(["lezzet", "page", "relatedLists", "blogHomePosts"]);
  fetchBlogHomePosts(state, onPageContentStateReady, req, res, 0);
  fetchLezzetPosts(state, onPageContentStateReady, req, res, 0, 5);
  fetchRelatedLists(state, onPageContentStateReady, req, res);
  fetchPageContent(state, onPageContentStateReady, req, res, contentURL);
}

function onPageContentStateReady(req, res, state) {
  if (state.page === 404) {
    render404(req, res);
  } else {
    app.render(req, res, "/", {
      ...state,
      title: state.page.title + " - İncili Gastronomi Rehberi",
      section: "page-content"
    });
  }
}

function renderRestoran(req, res, pathname) {
  const pathInfo = pathname.split("/");
  const restoranURL = pathInfo[2];

  var state = createState([
    "lezzet",
    "restoran",
    "latestPost",
    "relatedLists",
    "similarRestoran"
  ]);
  fetchLezzetPosts(state, onRestoranStateReady, req, res, 0, 5);
  fetchLatestPost(state, onRestoranStateReady, req, res);
  fetchRelatedLists(state, onRestoranStateReady, req, res);
  fetchRestoran(state, onRestoranStateReady, req, res, restoranURL);
  fetchSimilarRestoran(state, onRestoranStateReady, req, res);
}

function onRestoranStateReady(req, res, state) {
  if (state.restoran === 404) {
    render404(req, res);
  } else {
    app.render(req, res, "/", { ...state, section: "restoran" });
  }
}

function fetchPageContent(state, callback, req, res, contentURL) {
  admin
    .database()
    .ref("y18/pages")
    .orderByChild("s")
    .equalTo(contentURL.toLowerCase())
    .once("value")
    .then(function(snap) {
      if (snap.exists() === false) {
        state.page = 404;
      } else {
        var sVal = snap.val();

        for (var k in sVal) {
          sVal = sVal[k];
          break;
        }
        state.page = {
          title: sVal.t,
          content: sVal.c,
          image: sVal.i,
          urlName: sVal.s
        };
      }
      checkStateCompleteness(state, callback, req, res);
    })
    .catch(function(error) {
      console.log("fetchPageContent error", error);
      try {
        callback(req, res, state);
      } catch (e) {
        console.log("callback call error in fetchPageContent", e);
      }
    });
}

function fetchRestoran(state, callback, req, res, contentURL) {
  admin
    .database()
    .ref("y18/rd")
    .orderByChild("s")
    .equalTo(contentURL.toLowerCase())
    .once("value")
    .then(function(snap) {
      if (snap.exists() === false) {
        state.restoran = 404;
      } else {
        var sVal = snap.val();

        for (var k in sVal) {
          sVal = sVal[k];
          break;
        }
        state.restoran = {
          title: sVal.n,
          description: sVal.d,
          image:
            sVal.im == 0
              ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/b/" +
                sVal.m +
                "_" +
                (getNumberFromTitle(sVal.n) % 10) +
                ".jpg"
              : sVal.im,
          inci: sVal.i,
          price: Number(sVal.p),
          mutfak: mutfakFromIndex(Number(sVal.m)),
          city: cityFromIndex(Number(sVal.c)),
          placesQuery: sVal.pq,
          urlName: sVal.s,
          semt: sVal.se,
          creditcard: sVal.cc === 1,
          reservation: sVal.r === 1,
          handicap: sVal.in === 1,
          openAt: sVal.h,
          emoji: sVal.e,
          phone: sVal.ph,
          address: sVal.a
        };
      }
      checkStateCompleteness(state, callback, req, res);
    })
    .catch(function(error) {
      console.log("fetchRestoran error", error);
      try {
        callback(req, res, state);
      } catch (e) {
        console.log("callback call error in fetchRestoran", e);
      }
    });
}

function fetchTags(state, callback, req, res) {
  state.tags = [];

  /*
  {
    title:"Lorem1",
    strength:1
  },
  {
    title:"Lorem2",
    strength:2
  },
  {
    title:"Lorem3",
    strength:3
  },
  {
    title:"Lorem4",
    strength:4
  },
  {
    title:"Lorem5",
    strength:5
  }


*/
  checkStateCompleteness(state, callback, req, res);
}

function fetchSimilarRestoran(state, callback, req, res) {
  var i = Math.floor(Math.random() * 4) + 1;
  var indexes = todayLists["i" + i];
  var index = String(indexes[Math.floor(Math.random() * indexes.length)]);

  var i2 = Math.floor(Math.random() * 4) + 1;
  var indexes2 = todayLists["i" + i2];
  var index2 = String(indexes2[Math.floor(Math.random() * indexes2.length)]);

  admin
    .database()
    .ref("y18/il/" + "i" + String(i))
    .orderByKey()
    .equalTo(index)
    .once("value")
    .then(function(snap) {
      var arr = [];
      var sVal = snap.val();
      var obj = {
        image:
          sVal[index].t == 0
            ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
              sVal[index].m +
              "_" +
              (getNumberFromTitle(sVal[index].n) % 10) +
              ".jpg"
            : sVal[index].t,
        title: sVal[index].n,
        inci: sVal[index].i,
        caption: mutfakFromIndex(sVal[index].m),
        city: cityFromIndex(sVal[index].c) + " - " + sVal[index].se,
        price: sVal[index].p,
        urlName: sVal[index].s
      };
      arr.push(obj);

      admin
        .database()
        .ref("y18/il/" + "i" + String(i2))
        .orderByKey()
        .equalTo(index2)
        .once("value")
        .then(function(snap) {
          var sVal = snap.val();
          var obj = {
            image:
              sVal[index2].t == 0
                ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                  sVal[index2].m +
                  "_" +
                  (getNumberFromTitle(sVal[index2].n) % 10) +
                  ".jpg"
                : sVal[index2].t,
            title: sVal[index2].n,
            inci: sVal[index2].i,
            caption: mutfakFromIndex(sVal[index2].m),
            city: cityFromIndex(sVal[index2].c) + " - " + sVal[index2].se,
            price: sVal[index2].p,
            urlName: sVal[index2].s
          };
          arr.push(obj);

          state.similarRestoran = arr;

          checkStateCompleteness(state, callback, req, res);
        })
        .catch(function(error) {
          console.log("fetchSimilarRestoran 2 error", error);
          try {
            callback(req, res, state);
          } catch (e) {
            console.log("callback call error in fetchSimilarRestoran 2", e);
          }
        });
    })
    .catch(function(error) {
      console.log("fetchSimilarRestoran 1 error", error);
      try {
        callback(req, res, state);
      } catch (e) {
        console.log("callback call error in fetchSimilarRestoran 1", e);
      }
    });
}

function fetchList(state, callback, req, res, queryInfo, index) {
  admin
    .database()
    .ref(
      "y18/list/m" +
        String(queryInfo.mutfak) +
        "/c" +
        String(queryInfo.city) +
        "/p" +
        String(queryInfo.price) +
        "/i" +
        String(queryInfo.inci)
    )
    .orderByChild("li")
    .startAt(index)
    .limitToFirst(5)
    .once("value")
    .then(function(snap) {
      var arr = [];
      var sVal = snap.val();
      if (snap.exists() == false) {
        state["listItems"] = [];
        checkStateCompleteness(state, callback, req, res);
        return;
      }
      for (var k in sVal) {
        var obj = {
          image:
            sVal[k].t == 0
              ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                sVal[k].m +
                "_" +
                (getNumberFromTitle(sVal[k].n) % 10) +
                ".jpg"
              : sVal[k].t,
          title: sVal[k].n,
          inci: sVal[k].i,
          caption:
            mutfakFromIndex(sVal[k].m) +
            ", " +
            cityFromIndex(sVal[k].c) +
            " - " +
            sVal[k].se +
            " - " +
            tl(sVal[k].p),
          urlName: sVal[k].s,
          description: sVal[k].sh
        };
        arr.push(obj);
      }
      state["listItems"] = arr;
      checkStateCompleteness(state, callback, req, res);
    })
    .catch(function(error) {
      console.log("listItems err", error);
      try {
        callback(req, res, state);
      } catch (e) {
        console.log("callback call error in listItems", e);
      }
    });
}

function fetchArchivesNav(state, callback, req, res) {
  var now = new Date();
  var startingYear = Number(now.getFullYear());
  var startingMonth = Number(now.getMonth() + 1);
  var endYear = 2018;
  var endMonth = 11;

  var navigationObj = {};
  for (var i = startingYear; i >= endYear; i--) {
    navigationObj[i.toString()] = [];
    if (i === endYear) {
      for (var j = endMonth; j <= 12; j++) {
        navigationObj[i.toString()].push({
          title: monthNames[j - 1],
          month: j
        });
      }
    } else if (i === startingYear) {
      for (var j = 1; j <= startingMonth; j++) {
        navigationObj[i.toString()].push({
          title: monthNames[j - 1],
          month: j
        });
      }
    } else {
      for (var j = 1; j <= 12; j++) {
        navigationObj[i.toString()].push({
          title: monthNames[j - 1],
          month: j
        });
      }
    }
  }

  state.archivesNavigation = navigationObj;

  /*

  "2019":[{
    title:"Ocak"
  },{
    title:"Şubat"
  }],
  "2018":[{
    title:"Kasım"
  },{
    title:"Aralık"
  }]*/
  checkStateCompleteness(state, callback, req, res);
}

function fetchRelatedLists(state, callback, req, res) {
  state.relatedLists = todayLists["relatedLists"];

  checkStateCompleteness(state, callback, req, res);
}

function fetchLatestPost(state, callback, req, res, altArr = null) {
  cachePosts(function() {
    if (altArr === null) altArr = postsArr;
    state.latestPost = altArr[altArr.length - 1];
    checkStateCompleteness(state, callback, req, res);
  });
}

function fetchBlogContent(state, callback, req, res, contentURL) {
  cachePosts(function() {
    if (!posts[contentURL]) {
      render404(req, res);
      return;
    }
    state.thePost = posts[contentURL];
    checkStateCompleteness(state, callback, req, res);
  });
}

function fetchVitrin(state, callback, req, res) {
  admin
    .database()
    .ref("y18/r")
    .orderByChild("v")
    .equalTo(0)
    .limitToFirst(15)
    .once("value")
    .then(function(snap) {
      var arr = [];
      var sVal = snap.val();

      for (var k in sVal) {
        var obj = {
          image:
            sVal[k].t == 0
              ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                sVal[k].m +
                "_" +
                (getNumberFromTitle(sVal[k].n) % 10) +
                ".jpg"
              : sVal[k].t,
          title: sVal[k].n,
          inci: sVal[k].i,
          caption:
            mutfakFromIndex(sVal[k].m) +
            ", " +
            cityFromIndex(sVal[k].c) +
            " - " +
            sVal[k].se +
            " - " +
            tl(sVal[k].p),
          urlName: sVal[k].s,
          content: sVal[k].sh
        };
        arr.push(obj);
      }
      state.vitrin = arr;
      checkStateCompleteness(state, callback, req, res);
    })
    .catch(function(error) {
      console.log("vitrin err", error);
      try {
        callback(req, res, state);
      } catch (e) {
        console.log("callback call error in vitrin", e);
      }
    });
}

function fetchIncili(state, callback, req, res, inci, position = 0) {
  if (inci == 5) {
    state["incili" + inci] = [];
    admin
      .database()
      .ref("y18/r")
      .orderByChild("i")
      .equalTo(5)
      .limitToFirst(3)
      .once("value")
      .then(function(snap) {
        var arr = [];
        var sVal = snap.val();

        for (var k in sVal) {
          var obj = {
            image:
              sVal[k].t == 0
                ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                  sVal[k].m +
                  "_" +
                  (getNumberFromTitle(sVal[k].n) % 10) +
                  ".jpg"
                : sVal[k].t,
            title: sVal[k].n,
            inci: sVal[k].i,
            caption:
              mutfakFromIndex(sVal[k].m) +
              ", " +
              cityFromIndex(sVal[k].c) +
              " - " +
              sVal[k].se +
              " - " +
              tl(sVal[k].p),
            urlName: sVal[k].s,
            description: sVal[k].sh
          };
          arr.push(obj);
        }
        state["incili" + inci] = arr;
        checkStateCompleteness(state, callback, req, res);
      })
      .catch(function(error) {
        console.log("inicli5 err", error);
        try {
          callback(req, res, state);
        } catch (e) {
          console.log("callback call error in incili5", e);
        }
      });
  } else {
    var indexes = todayLists["i" + inci];
    var cnt = 5;
    if (inci == 4) cnt = 4;
    var arr = [];
    var broken = false;
    position = Number(position);
    for (var i = position; i < position + cnt; i++) {
      // if(indexes.length <= i){
      //   state["incili"+inci]= arr;
      //   checkStateCompleteness(state,callback,req,res);
      //   break;
      // }
      let index = String(indexes[i]);
      admin
        .database()
        .ref("y18/il/" + "i" + String(inci))
        .orderByKey()
        .equalTo(index)
        .once("value")
        .then(function(snap) {
          // if(broken) return;
          if (snap.exists) {
            var sVal = snap.val();
            if (sVal === null) {
              state["incili" + inci] = arr;
              checkStateCompleteness(state, callback, req, res);
              broken = true;
            } else {
              var obj = {
                image:
                  sVal[index].t == 0
                    ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                      sVal[index].m +
                      "_" +
                      (getNumberFromTitle(sVal[index].n) % 10) +
                      ".jpg"
                    : sVal[index].t,
                title: sVal[index].n,
                inci: sVal[index].i,
                caption:
                  mutfakFromIndex(sVal[index].m) +
                  ", " +
                  cityFromIndex(sVal[index].c) +
                  " - " +
                  sVal[index].se +
                  " - " +
                  tl(sVal[index].p),
                urlName: sVal[index].s,
                description: sVal[index].sh
              };
              arr.push(obj);
              if (arr.length == cnt || broken) {
                state["incili" + inci] = arr;
                checkStateCompleteness(state, callback, req, res);
                broken = true;
              }
            }
          } else {
            state["incili" + inci] = arr;
            checkStateCompleteness(state, callback, req, res);
            broken = true;
          }
        })
        .catch(function(error) {
          console.log("incili not 5 error", error);
          try {
            callback(req, res, state);
          } catch (e) {
            console.log("callback call error in incili not 5", e);
          }
        });
    }
  }
}

function fetchBlogHomePosts(state, callback, req, res, shift, altArr = null) {
  cachePosts(function() {
    if (altArr === null) altArr = postsArr;
    var arr = [];
    for (
      var i = altArr.length - 2 - shift;
      i >= (altArr.length - 13 - shift >= 0 ? altArr.length - 13 - shift : 0);
      i--
    ) {
      arr.push(altArr[i]);
    }
    state.blogHomePosts = arr;
    checkStateCompleteness(state, callback, req, res);
  });
}

function fetchSimilarPosts(state, callback, req, res, contentURL) {
  cachePosts(function() {
    const arr = [];
    for (var i = postsArr.length - 1; i >= 0; i--) {
      if (postsArr[i].urlName !== contentURL) {
        arr.push(postsArr[i]);
        if (arr.length === 3) break;
      }
    }
    state.similarPosts = arr;
    checkStateCompleteness(state, callback, req, res);
  });
}

function fetchPopularPosts(state, callback, req, res) {
  cachePosts(function() {
    const arr = [];
    for (var i = postsArr.length - 2; i >= 0; i--) {
      // if(postsArr[i].urlName !== contentURL){
      arr.push(postsArr[i]);
      if (arr.length === 3) break;
      // }
    }
    state.popularPosts = arr;
    checkStateCompleteness(state, callback, req, res);
  });
}

function fetchLezzetPosts(state, callback, req, res, position, count) {
  var indexes = todayLists["i0"];
  var cnt = Number(count);
  var arr = [];
  var broken = false;
  position = Number(position);
  for (var i = position; i < position + cnt; i++) {
    if (indexes.length <= i) {
      state.lezzet = arr;
      checkStateCompleteness(state, callback, req, res);
      break;
    }
    let index = String(indexes[i]);

    admin
      .database()
      .ref("y18/il/i0")
      .orderByKey()
      .equalTo(index)
      .once("value")
      .then(function(snap) {
        if (broken) return;
        if (snap.exists) {
          var sVal = snap.val();
          var obj = {
            image:
              sVal[index].t == 0
                ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                  sVal[index].m +
                  "_" +
                  (getNumberFromTitle(sVal[index].n) % 10) +
                  ".jpg"
                : sVal[index].t,
            title: sVal[index].n,
            caption:
              mutfakFromIndex(sVal[index].m) +
              ", " +
              cityFromIndex(sVal[index].c) +
              " - " +
              sVal[index].se,
            urlName: sVal[index].s
          };
          arr.push(obj);
          if (arr.length == cnt) {
            state.lezzet = arr;
            checkStateCompleteness(state, callback, req, res);
            broken = true;
          }
        } else {
          state.lezzet = arr;
          checkStateCompleteness(state, callback, req, res);
          broken = true;
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

function createState(keys) {
  var rv = {};
  for (var i = 0; i < keys.length; i++) {
    rv[keys[i]] = null;
  }
  return rv;
}

function checkStateCompleteness(state, callback, req, res) {
  for (var k in state) {
    if (state[k] === null) return;
  }
  try {
    callback(req, res, state);
  } catch (e) {
    console.log("callback call error in checkStateCompleteness", e);
  }
}

function mutfakFromIndex(i) {
  switch (i) {
    case -1:
      return "Tüm Mutfaklar";
    case 0:
      return "Şef Restoranı. Bistro. Brasserie";
    case 1:
      return "Geleneksel Mutfak";
    case 2:
      return "Et Lokantası / Kebapçı";
    case 3:
      return "Balık Lokantası";
    case 4:
      return "Uzak Doğu Restoranı";
    case 5:
      return "Meyhane";
    case 6:
      return "Sokak Yemeği Restoranı";
  }
  return "";
}

function cityFromIndex(i) {
  switch (i) {
    case -1:
      return "Tüm Şehirler";
    case 0:
      return "İstanbul";
    case 1:
      return "İzmir";
    case 2:
      return "Ankara";
    case 3:
      return "Bodrum";
  }
  return "";
}

function getMutfakFromSlug(mutfak) {
  switch (mutfak) {
    case "tum-mutfaklar":
      return -1;
    case "sef-restorani-bistro-brasserie":
      return 0;
    case "geleneksel-mutfak":
      return 1;
    case "et-lokantasi-kebapci":
      return 2;
    case "balik-lokantasi":
      return 3;
    case "uzak-dogu-restorani":
      return 4;
    case "meyhane":
      return 5;
    case "sokak-yemegi-restorani":
      return 6;
  }
}

function getCityFromSlug(city) {
  switch (city) {
    case "tum-sehirler":
      return -1;
    case "istanbul":
      return 0;
    case "izmir":
      return 1;
    case "ankara":
      return 2;
    case "bodrum":
      return 3;
  }
}

function getInciFromSlug(inci) {
  switch (inci) {
    case "tum-inciler":
      return -1;
    case "bir-incili":
      return 1;
    case "iki-incili":
      return 2;
    case "uc-incili":
      return 3;
    case "dort-incili":
      return 4;
    case "bes-incili":
      return 5;
  }
}

function getPriceFromSlug(price) {
  switch (price) {
    case "tum-ucret-araliklari":
      return -1;
    case "0-50-tl":
      return 1;
    case "50-100-tl":
      return 2;
    case "100-250-tl":
      return 3;
    case "250-tl-ustu":
      return 4;
  }
}

function tl(l) {
  var rv = "";
  for (var i = 0; i < l; i++) {
    rv += "₺";
  }
  return rv;
}

function inci(inc) {
  switch (inc) {
    case 5:
      return "Beş İncili";
    case 4:
      return "Dört İncili";
    case 3:
      return "Üç İncili";
    case 2:
      return "İki İncili";
    case 1:
      return "Bir İncili";
    case 0:
      return "Lezzet Noktası";
    default:
      return "Tüm İnciler";
  }
}

function checkLists(callback) {
  var today = new Date();
  var dateStr = today.getDate() + today.getMonth() + today.getFullYear();
  if (todayListDate != dateStr) {
    populateLists(callback);
  } else {
    callback();
  }
}

function populateLists(callback) {
  console.log("PopulateLists");
  admin
    .database()
    .ref("y18/cnt")
    .once("value")
    .then(function(snap) {
      var sVal = snap.val();
      for (var k in sVal) {
        var indexes = populateIndexes(sVal[k]);
        var indexLength = indexes.length;
        todayLists[k] = [];
        for (var i = 0; i < indexLength; i++) {
          var ii = Math.floor(Math.random() * indexes.length);
          var ind = indexes[ii];
          todayLists[k].push(ind);
          indexes.splice(ii, 1);
        }
      }

      todayLists["relatedLists"] = [];

      for (var i = 0; i < 9; i++) {
        var list = "";
        var obj = {};

        while (todayLists["relatedLists"].indexOf(list) !== -1 || list === "") {
          var mIndex = {
            m: Math.floor(Math.random() * 7),
            c: Math.floor(Math.random() * 4)
            /*i:Math.floor(Math.random()*5+1),*/
            /*p:Math.floor(Math.random()*4+1),*/
          };

          var kriters = ["m", "c" /*,'i','p'*/];
          var kriter0i = Math.floor(Math.random() * kriters.length);
          var kriter0k = kriters[kriter0i];
          var kriter0 = mIndex[kriter0k];

          kriters.splice(kriter0i, 1);

          var kriter1i = Math.floor(Math.random() * kriters.length);
          var kriter1k = kriters[kriter1i];
          var kriter1 = mIndex[kriter1k];

          var result = {
            m: -1,
            c: -1,
            i: -1,
            p: -1
          };

          result[kriter0k] = kriter0;
          result[kriter1k] = kriter1;

          list =
            getMutfakSlugFromIndex(result.m) +
            "/" +
            getCitySlugFromIndex(result.c) +
            "/" +
            getInciSlugFromIndex(result.i) +
            "/" +
            getPriceSlugFromIndex(result.p);

          obj.title =
            mutfakFromIndex(result.m) +
            ", " +
            cityFromIndex(
              result.c
            ) /*+", "+inci(result.i)+", "+(tl(result.p) ? tl(result.p) : "Tüm Ücret Aralıkları");*/;
          obj.urlName = list;
        }

        todayLists["relatedLists"].push(obj);
      }

      var today = new Date();
      todayListDate = today.getDate() + today.getMonth() + today.getFullYear();

      callback();
    })
    .catch(function(error) {
      console.log("populate list err", error);
    });
}

function populateIndexes(l) {
  var arr = [];
  for (var i = 0; i < l; i++) {
    arr.push(i);
  }
  return arr;
}

function setEmoji(slug, emojiIndex) {
  admin
    .database()
    .ref("y18/rd")
    .orderByChild("s")
    .equalTo(slug.toLowerCase())
    .once("value")
    .then(function(snap) {
      if (snap.exists()) {
        var sVal = snap.val();
        var k;
        for (k in sVal) {
          sVal = sVal[k];
          break;
        }
        let o = { e: [...sVal.e] };
        o.e[emojiIndex] = Number(o.e[emojiIndex]) + 1;

        admin
          .database()
          .ref("y18/rd/" + k)
          .update(o);
      }
    })
    .catch(function(error) {
      console.log("setEmoji error", error);
    });
}

function getMutfakSlugFromIndex(ind) {
  var link = "";

  switch (ind) {
    case -1:
      link += "tum-mutfaklar";
      break;
    case 0:
      link += "sef-restorani-bistro-brasserie";
      break;
    case 1:
      link += "geleneksel-mutfak";
      break;
    case 2:
      link += "et-lokantasi-kebapci";
      break;
    case 3:
      link += "balik-lokantasi";
      break;
    case 4:
      link += "uzak-dogu-restorani";
      break;
    case 5:
      link += "meyhane";
      break;
    case 6:
      link += "sokak-yemegi-restorani";
      break;
  }

  return link;
}

function getCitySlugFromIndex(ind) {
  var link = "";
  switch (ind) {
    case -1:
      link += "tum-sehirler";
      break;
    case 0:
      link += "istanbul";
      break;
    case 1:
      link += "izmir";
      break;
    case 2:
      link += "ankara";
      break;
    case 3:
      link += "bodrum";
      break;
  }
  return link;
}

function getInciSlugFromIndex(ind) {
  var link = "";

  switch (ind) {
    case -1:
      link += "tum-inciler";
      break;
    case 1:
      link += "bir-incili";
      break;
    case 2:
      link += "iki-incili";
      break;
    case 3:
      link += "uc-incili";
      break;
    case 4:
      link += "dort-incili";
      break;
    case 5:
      link += "bes-incili";
      break;
  }

  return link;
}

function getPriceSlugFromIndex(ind) {
  var link = "";

  switch (ind) {
    case -1:
      link += "tum-ucret-araliklari";
      break;
    case 1:
      link += "0-50-tl";
      break;
    case 2:
      link += "50-100-tl";
      break;
    case 3:
      link += "100-250-tl";
      break;
    case 4:
      link += "250-tl-ustu";
      break;
  }

  return link;
}

function indLowerCase(str) {
  var l = str.length;
  var rv = "";
  for (var i = 0; i < l; i++) {
    switch (str[i]) {
      case "i":
        rv += "i";
        break;
      case "ı":
        rv += "i";
        break;
      case "ş":
        rv += "s";
        break;
      case "ö":
        rv += "o";
        break;
      case "ü":
        rv += "u";
        break;
      case "ğ":
        rv += "g";
        break;
      case "ç":
        rv += "c";
        break;
      case "İ":
        rv += "i";
        break;
      case "I":
        rv += "i";
        break;
      case "Ş":
        rv += "s";
        break;
      case "Ö":
        rv += "o";
        break;
      case "Ü":
        rv += "u";
        break;
      case "Ğ":
        rv += "g";
        break;
      case "Ç":
        rv += "c";
        break;
      case "-":
      case "_":
      case '"':
      case "!":
      case "'":
      case "?":
        rv += "";
        break;
      default:
        rv += str[i].toLowerCase();
    }
  }
  return rv;
}

function searchName(queryText, callback) {
  admin
    .database()
    .ref("y18/r")
    .orderByChild("ind")
    .startAt(indLowerCase(queryText))
    .endAt(indLowerCase(queryText) + "\uf8ff")
    .limitToFirst(10)
    .once("value")
    .then(function(snap) {
      var sVal = snap.val();
      var arr = [];
      for (var k in sVal) {
        var obj = {
          image:
            sVal[k].t == 0
              ? "https://medyanet.doracdn.com/proje/dc/igr/r/ph3/s/" +
                sVal[k].m +
                "_" +
                (getNumberFromTitle(sVal[k].n) % 10) +
                ".jpg"
              : sVal[k].t,
          title: sVal[k].n,
          inci: sVal[k].i,
          caption:
            mutfakFromIndex(sVal[k].m) +
            ", " +
            cityFromIndex(sVal[k].c) +
            " - " +
            sVal[k].se +
            " - " +
            tl(sVal[k].p),
          urlName: sVal[k].s,
          description: sVal[k].sh
        };
        arr.push(obj);
      }
      callback(arr);
    });
}

function getNumberFromTitle(title) {
  var rv = 0;
  for (var i = 0; i < title.length; i++) {
    rv += Number(title.charCodeAt(i));
  }
  return rv;
}

function cachePosts(callback) {
  if (posts !== null) {
    callback();
    return;
  }

  admin
    .database()
    .ref("y18/blog")
    .orderByChild("date")
    .once("value")
    .then(function(snap) {
      posts = snap.val();
      postsArr = [];
      snap.forEach(function(child) {
        postsArr.push(child.val());
      });
      callback();
    });
}

function getSiteMapXML(pages, restorans) {
  var today = new Date();
  todayMod =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var modStart = "2018-12-18";

  var rv = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  rv += getSiteMapURL("", todayMod);
  rv += getSiteMapURL("blog", todayMod);
  rv += getSiteMapURL("yeni-acilanlar" + k, todayMod);

  for (var k in posts) {
    var modDate = new Date(posts[k].date);
    mod =
      modDate.getFullYear() +
      "-" +
      (modDate.getMonth() + 1) +
      "-" +
      modDate.getDate();
    rv += getSiteMapURL("blog/" + k, mod);
  }

  for (var k in pages) {
    rv += getSiteMapURL("sayfa/" + k, modStart);
  }

  for (var k in restorans) {
    rv += getSiteMapURL("restoran/" + restorans[k].s, modStart);
  }
  for (var mutfak = -1; mutfak <= 6; mutfak++) {
    for (var city = -1; city <= 3; city++) {
      for (var inci = -1; inci <= 5; inci++) {
        if (inci != 0) {
          for (var tl = -1; tl <= 4; tl++) {
            if (tl != 0) {
              var url = "/liste/" + getMutfakSlugFromIndex(mutfak);
              url += "/" + getCitySlugFromIndex(city);
              url += "/" + getInciSlugFromIndex(inci);
              url += "/" + getPriceSlugFromIndex(tl);
              rv += getSiteMapURL(url, modStart);
            }
          }
        }
      }
    }
  }

  rv += "</urlset>";
  return rv;
}

var cnt = 0;
function getSiteMapURL(uri, lastmod) {
  cnt++;
  var rv = "<url>";
  rv +=
    "<loc>https://inciligastronomirehberi.hurriyet.com.tr/" +
    uri.replaceAll("&", "&amp;") +
    "</loc>";
  rv += "<lastmod>" + lastmod + "</lastmod>";
  rv += "</url>";
  return rv;
}

function fetchPageMapList(callback) {
  admin
    .database()
    .ref("y18/pages")
    .once("value")
    .then(function(snap) {
      if (snap.exists() === false) {
        callback({});
      } else {
        var sVal = snap.val();
        callback(sVal);
      }
    })
    .catch(function(error) {
      console.log("fetchPageMapList error", error);
      try {
        callback({});
      } catch (e) {
        console.log("callback call error in fetchPageMapList", e);
      }
    });
}

function fetchRestoranMapList(callback) {
  admin
    .database()
    .ref("y18/r")
    .once("value")
    .then(function(snap) {
      if (snap.exists() === false) {
        callback({});
      } else {
        var sVal = snap.val();
        callback(sVal);
      }
    })
    .catch(function(error) {
      console.log("fetchRestoranMapList error", error);
      try {
        callback({});
      } catch (e) {
        console.log("callback call error in fetchRestoranMapList", e);
      }
    });
}
