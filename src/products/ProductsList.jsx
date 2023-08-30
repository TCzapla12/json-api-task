import { Form, Formik } from "formik";
import { useQuery } from "jsonapi-react";
import { useState, useEffect } from "react";
import { indirectUrlProducts } from "../endpoints";

export default function ProductsList() {
    const { products } = useQuery(indirectUrlProducts);
    const [productsList, setProductsList] = useState([]);

    useEffect(() => {
        if (products) {
            setProductsList(products.filter((product) => { return product.is_salable === 1 }))
        }
    }, [products])

    const initialValues = {
        availability: 'available',
        manufacturer: ''
    }

    function getGrossPrice(product) {
        let netPrice = product.price;
        if (product.promotion_discount > 0) {
            netPrice = netPrice * (1 - (product.promotion_discount / 100));
        }
        return Math.round(((netPrice * (1 + (product.tax / 100))) * 100)) / 100;
    }

    function searchProducts(values) {
        if (values.availability === 'available') {
            setProductsList(products.filter((product) => { return product.is_salable === 1 && product.manufacturer.includes(values.manufacturer) }));
        }
        else if (values.availability === 'notAvailable') {
            setProductsList(products.filter((product) => { return product.is_salable === 0 && product.manufacturer.includes(values.manufacturer) }));
        }
        else {
            setProductsList(products.filter((product) => { return product.manufacturer.includes(values.manufacturer) }));
        }
    }

    return <>
        <Formik initialValues={initialValues} onSubmit={(values) => searchProducts(values)}>{(formikProps) => (
            <>
                <Form>
                    <div className="row gx-3 align-items-center mb-3 gy-3">
                        <div className="col-auto w-25">
                            <input type="text" className="form-control" id="manufacturer" placeholder="Name of the manufacturer" {...formikProps.getFieldProps("manufacturer")} />
                        </div>
                        <div className="col-auto">
                            <select className="form-select" {...formikProps.getFieldProps("availability")}
                            >
                                <option value="0">--Availability--</option>
                                <option value="available">In Stock</option>
                                <option value="notAvailable">Out of stock</option>
                            </select>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-primary" onClick={() => {
                                formikProps.submitForm();
                            }}>
                                Filter
                            </button>
                            <button
                                className="btn btn-danger ms-3"
                                onClick={() => {
                                    formikProps.setValues(initialValues);
                                    searchProducts(initialValues);
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </Form>
            </>
        )}</Formik>
        {productsList ? <table className="table">
            <thead></thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Manufacturer</th>
                <th>Availability</th>
                <th>Price (net/gross)</th>
                <th>New Product</th>
            </tr>
            <tbody>
                {productsList?.map((product) => (
                    <tr key={product.entity_id}>
                        <td>{product.name}</td>
                        <td>{product.description}</td>
                        <td>{product.manufacturer}</td>
                        <td>{product.is_salable === 1 ? 'In Stock' : 'Out of Stock'}</td>
                        <td>{product.price}/{getGrossPrice(product)} {product.promotion ? `(${product.promotion})` : null}</td>
                        <td>{product.new_product ? 'Yes' : null}</td>
                    </tr>)
                )}
            </tbody>
        </table> : null}
    </>
}