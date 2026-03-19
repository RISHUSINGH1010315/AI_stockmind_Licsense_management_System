import API from "../../api/axios";

function ChoosePlan() {

    const subscribe = async (planId) => {

        await API.post("/subscription/create-subscription", {
            planId,
            companyId: 1,
            amount: 2999
        });

        alert("Subscription activated");

    };

    return (

        <div>

            <h1>Choose Plan</h1>

            <button onClick={() => subscribe(1)}>
                Basic
            </button>

            <button onClick={() => subscribe(2)}>
                Pro
            </button>

        </div>

    )

}

export default ChoosePlan;