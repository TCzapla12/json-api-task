import './ProductCard.css';

export default function ProductCard(props) {

    function getGrossPrice(product) {
        let netPrice = product.price;
        if (product.promotion_discount > 0) {
            netPrice = netPrice * (1 - (product.promotion_discount / 100));
        }
        return Math.round(((netPrice * (1 + (product.tax / 100))) * 100)) / 100;
    }
    function getOldPrice(product) {
        let netPrice = product.price;
        return Math.round(((netPrice * (1 + (product.tax / 100))) * 100)) / 100;
    }

    function getClassAvailability(value){
        if(value===1){
            return "in-stock"
        } else return "out-of-stock"

    }

    return <div className="card">
        <ul className='list-group'>
            <li className="list-group-item">
                <h5 className="card-title">{props.product.name}</h5>
                <div className=''>
                    {props.product.new_product ? <div className="btn btn-primary btn-sm rounded-pill me-2 cursor-default">New</div> : null}
                    {props.product.promotion ? <div className="btn btn-danger btn-sm rounded-pill cursor-default">{props.product.promotion}</div>
                        : null}
                </div>
                <div className='card-text mt-2'>
                    <span className='card-details'>Manufacturer: </span><span>{props.product.manufacturer}</span>
                    <p className="mt-4 card-details-2">{props.product.description}</p>
                </div></li>
            <li className="list-group-item card-footer">
                <h6>Net: {props.product.price}$<br />
                    Gross: {props.product.promotion ? <span><span className='text-danger old-price'>{getOldPrice(props.product)}$</span> {getGrossPrice(props.product)}</span> : <span>{getGrossPrice(props.product)}</span>}$
                </h6>
                <h6 className={getClassAvailability(props.product.is_salable)}>
                {props.product.is_salable === 1 ? 'In Stock' : 'Out of Stock'}
                </h6>
            </li>
        </ul>
    </div>
}

