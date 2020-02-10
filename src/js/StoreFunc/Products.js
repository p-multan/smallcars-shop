const contentful = require('contentful');
const client = contentful.createClient({
  space: 'no2uuty6d9no',
  accessToken: 'IX1OcrSAianx8IbFxUxsq28eonCtsrBVhM-iqc3JVjI'
});

export class Products {
  async getProducts() {
    try {
      const content = await client.getEntries({
        content_type: 'smallCars'
      });
      let products = content.items;
      products = products.map(product => {
        const { title, price, description } = product.fields;
        const { id } = product.sys;
        const image = `https:${product.fields.image.fields.file.url}`;
        return { title, price, description, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
