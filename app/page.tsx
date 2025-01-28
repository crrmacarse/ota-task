const HomePage = async () => {
    return (
        <div className="flex min-h-screen justify-center items-center">
            <div>
                <h1>
                    Your streak is 6 days
                </h1>
                <ul className="grid grid-cols-7">
                    <li>
                        1
                    </li>
                    <li>
                        2
                    </li>
                    <li>
                        2
                    </li>
                </ul>
            </div>
        </div>
    )
};

export default HomePage;