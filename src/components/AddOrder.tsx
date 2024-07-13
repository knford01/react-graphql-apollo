import { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';

export type AppProps = {
    customerId: number
}

const GET_DATA = gql`
    {
        customers {
            id
            name
            contact
              orders {
              description
              totalInCents
            }
        }
    }
`;

const MUTATE_DATA = gql`
mutation MUTATE_DATA(
    $description: String!, 
    $totalInCents: Int!, 
    $customer: ID 
){
    createOrder(customer: $customer, description: $description, totalInCents: $totalInCents) {
        order {
            id
            customer {
            id
            }
            description
            totalInCents
        }
    }
}`;

export default function AddOrder({ customerId }: AppProps) {
    const [active, setActive] = useState(false);
    const [description, setDescription] = useState('');
    const [total, setTotal] = useState(NaN);

    const [createOrder, { loading, error, data },] = useMutation(MUTATE_DATA, {
        refetchQueries: [
            { query: GET_DATA }, // DocumentNode object parsed with gql
        ],
    });

    useEffect(() => {
        if (data) {
            console.log(data);
            setDescription('');
            setTotal(NaN);
        }
    }, [data])

    return <div className="mt-4">
        {active ? null : (
            <button
                onClick={() => setActive(true)}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            >
                + New Order
            </button>
        )}
        {active ? (
            <div className="mt-4">
                <form
                    className="bg-white p-6 rounded shadow-md"
                    onSubmit={(e) => {
                        e.preventDefault();
                        createOrder({
                            variables: {
                                customer: customerId,
                                description: description,
                                totalInCents: total
                            }
                        });
                        // console.log(customerId, description, total);
                    }}
                >
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Service or product provided):</label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="total" className="block text-gray-700 text-sm font-bold mb-2">Cost (In Cents):</label>
                        <input
                            id="total"
                            type="number"
                            value={isNaN(total) ? '' : total}
                            onChange={(e) => setTotal(parseFloat(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                            disabled={loading}
                        >
                            + Add Order
                        </button>
                        <button
                            onClick={() => setActive(false)}
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                {error ? <p className="mt-4 text-red-500">Something went wrong</p> : null}
            </div>
        ) : null}
    </div>
}