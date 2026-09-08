import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../domain/product/entity/product";
import ProductRepository from "../../infrastructure/product/repository/sequelize/product.repository";

describe("Product repository tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        
        await productRepository.create(product);
        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        if (!productModel) {
            throw new Error("Product was not created");
        }
        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 100,
        });
    });

    it("should update a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        
        await productRepository.create(product);
        product.changePrice(150);
        await productRepository.update(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });

        if (!productModel) {
            throw new Error("Product was not updated");
        }
        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 150,
        });
    });

    it("should delete a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        
        await productRepository.create(product);
        const createdProduct = await ProductModel.findOne({ where: { id: "1" } });
        expect(createdProduct).not.toBeNull();

        await productRepository.delete("1");
        const deletedProduct = await ProductModel.findOne({ where: { id: "1" } });
        expect(deletedProduct).toBeNull();
    });

    it("should find a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: "1" } });
        const foundProduct = await productRepository.find("1");

        if (!productModel || !foundProduct) {
            throw new Error("Product was not found");
        }
        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price
        });
    });

    it("should find all products", async () => {
        const productRepository = new ProductRepository();

        const product1 = new Product("1", "Product 1", 100);
        await productRepository.create(product1);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();
        const products = [product1, product2];

        expect(products).toEqual(foundProducts);
    });
});
