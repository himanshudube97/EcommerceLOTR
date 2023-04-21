class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    // const queryStrCopy = this.queryStr   {not writing like this because in js, object is passed by reference, so original queryStr change ho jayega, so we are making a copy of it and modifying it}
    const queryStrCopy = { ...this.queryStr };

    //Removing some fields for category
    // ye 3 filter ke part nahi honge, keyword search() ka part hoga, baki 2 pagination ke.
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => {
      delete queryStrCopy[key];
    });
    console.log(queryStrCopy, "copy");

    //Filter for Price and Rating

    let queryNew = JSON.stringify(queryStrCopy);
    console.log(queryNew, 'querystr')
    queryNew = queryNew.replace(/\b(gt|gte|lt|lte)\b/g, (key)=> `$${key}`);  //regex isliye use kiya if ese expression hoga tabhi modify hoga.
    console.log(queryNew, 'modiquerystr')

    console.log(JSON.parse(queryNew), 'parsedquerystr');


    this.query = this.query.find(JSON.parse(queryNew));
    return this;
  }
  pagination(resultPerPage){
   const currentPage = Number(this.queryStr.page) || 1
   const skip = resultPerPage * (currentPage - 1);
   console.log(skip, "skip");
  //  this.query = this.query.skip(skip).limit(resultPerPage)
  this.query = this.query.limit(resultPerPage).skip(skip);
   return this;
  }
}

module.exports = ApiFeatures;

//issue is ki, ek sath search aur filter chal rhe hain.


// is code main searc() ke baad filter() chal rha hai, means ki agar search() empty hai to all products aayega and whai filter hoga, else jo search hoga phle usse hi aaghe fitler hoga data.