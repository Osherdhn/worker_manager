function Title(props) {
    const { mainTxt } = props;

    return (
        <header>
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center text-warning bg-secondary">
                <h1 className="display-6 fw-bold">
                    {mainTxt}
                </h1>
                <br/>
                {
                    props.children
                }
            </div>
        </header>
    );
}

export default Title;