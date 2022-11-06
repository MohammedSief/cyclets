import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Home() {

  // const API_KEY = "b40755f6db32468a92aadab728a09485";

  const [allNews1, setAllNews1] = useState([]);
  const [allNews2, setAllNews2] = useState([]);


  async function getNews1() {
    let { data } = await axios.get("https://newsapi.org/v2/top-headlines?country=us&apiKey=b40755f6db32468a92aadab728a09485");
    setAllNews1(data.articles.splice(0, 10));

    console.log(data.articles);
    console.log(allNews1);
  }

  async function getNews2() {
    let { data } = await axios.get("https://newsapi.org/v2/top-headlines?country=us&apiKey=b40755f6db32468a92aadab728a09485");
    setAllNews2(data.articles.splice(10, 20));

    console.log(data.articles);
    console.log(allNews2);
  }


  useEffect(() => {
    getNews1(); // we call "getNews()" when "component did mount"
    getNews2();
  }, []);


  return (
    <>

      <h1>Home Page</h1>

      {allNews1.length > 0 ?

        <div className="container">

          <div className="row">
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <h2>POSTS FROM EVERYWHERE IN THE WORLD - PART 1</h2>
            </div>

            {allNews1.map((article, index) =>

              <div className="col-md-2" key={index}>
                <div className="article position-relative" >

                  <Link to={`/productDetails/${article.publishedAt}`}>
                    <img src={article.urlToImage} className="w-100" alt="" />
                    <h4 className='fw-bold'>{article.title}</h4>
                    <p> {article.description} </p>
                    <span className="rating position-absolute top-0 end-0 bg-danger p-1">7.5</span>
                  </Link>

                </div>
              </div>

            )}

          </div>





          <div className="row">
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <h2>POSTS FROM EVERYWHERE IN THE WORLD - PART 2</h2>
            </div>

            {allNews2.map((article, index) =>

              <div className="col-md-2" key={index}>
                <div className="article position-relative" >

                  <Link to={`/productDetails/${article.publishedAt}`}>
                    <img src={article.urlToImage} className="w-100" alt="" />
                    <h4 className='fw-bold'>{article.title}</h4>
                    <p> {article.description} </p>
                    <span className="rating position-absolute top-0 end-0 bg-danger p-1">7.5</span>
                    </Link >
                </div>
              </div>

            )}

          </div>

        </div>

        :

        <h2 className='text-center'>
          Loading <i className='fas fa-spinner fa-spin'></i>
        </h2>

      }



    </>
  )
}


/*
We could use Substr() to cut part of the title
example:
<h4 className='fw-bold'>{article.title.Substr(0,10)}</h4>
*/