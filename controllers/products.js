const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  // this route just for testing
  const products = await Product.find({ price: { $gt: 100 } })
    .sort('price')
    .select('price name')

  res.status(200).json({ totalProducts: products.length, products })
}

const getAllProducts = async (req, res) => {
  // get all products or query products
  const { featured, brand, name, sort, fields, numericFilters } = req.query
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if (brand) {
    queryObject.brand = brand
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    const regEx = /\b(<|>|>=|=|<|<=)\b/g
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )
    // console.log(filters)
    const options = ['price', 'rating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }
  console.log(queryObject)

  let result = Product.find(queryObject)

  if (sort) {
    // products = products.sort()
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createAt')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)
  // 23 products
  // 4 pages: 7 7 7 2
  // => if user want page number 2 => skip = 7 (2-1)*7

  const products = await result
  res.status(200).json({ totalProducts: products.length, products })
}

module.exports = { getAllProducts, getAllProductsStatic }
