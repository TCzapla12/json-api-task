import { Form, Formik } from "formik";
import { useQuery } from "jsonapi-react";
import { useState, useEffect } from "react";
import { indirectUrlProducts } from "../endpoints";
import ProductCard from "./ProductCard";
import './ProductsList.css'

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

    function searchProducts(values) {
        if (values.availability === 'available') {
            setProductsList(products.filter((product) => { return product.is_salable === 1 && product.stock>0 && product.manufacturer.toLowerCase().includes(values.manufacturer.toLowerCase()) }));
        }
        else if (values.availability === 'notAvailable') {
            setProductsList(products.filter((product) => { return product.is_salable === 1 && product.stock===0 &&product.manufacturer.toLowerCase().includes(values.manufacturer.toLowerCase()) }));
        }
        else {
            setProductsList(products.filter((product) => { return product.manufacturer.toLowerCase().includes(values.manufacturer.toLowerCase()) }));
        }
    }

    return <>
        <Formik initialValues={initialValues} onSubmit={(values) => searchProducts(values)}>{(formikProps) => (
            <>
                <Form>
                    <div className="filters">
                        <div className="col-auto manufacturer-filter">
                            <input type="text" className="form-control" id="manufacturer" placeholder="Manufacturer" {...formikProps.getFieldProps("manufacturer")} />
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
                <div className="products-list">
                    {productsList?.map((product) => (
                        <ProductCard product={product} key={product.entity_id} />)
                    )}
                </div>

            </>
        )}</Formik>
    </>
}