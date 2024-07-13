import './tailwind.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import AddOrder from './components/AddOrder';

export type Order = {
  id: number;
  description: string;
  totalInCents: number;
}

export type Customer = {
  id: number;
  name: string;
  contact: string;
  orders: Order[]
};

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
    mutation MUTATE_DATA($name: String!, $contact: String!) {
        createCustomer(name: $name, contact: $contact) {
            customer {
                id
                name
            }
        }
    }
`;

function App() {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const { loading, error, data } = useQuery(GET_DATA);
  const [
    createCustomer,
    {
      loading: createCustomerLoading,
      error: createCustomerError,
      data: createCustomerData,
    },
  ] = useMutation(MUTATE_DATA, {
    refetchQueries: [
      { query: GET_DATA }, // DocumentNode object parsed with gql
    ],
  });

  useEffect(() => {
    console.log(loading, error, data);
    console.log(
      createCustomer,
      createCustomerLoading,
      createCustomerError,
      createCustomerData
    );
  });

  return (
    <div className="App p-4">
      {error ? <p>Something went wrong</p> : null}
      {loading ? <p>loading...</p> : null}
      {data
        ? data.customers.map((customer: Customer) => {
          return (
            <div className="customerElement mb-6 p-6 border rounded shadow-sm" key={customer.id}>
              <p className="text-lg font-semibold mb-2">Customer: {customer.name}</p>
              <p className="text-md text-gray-600 mb-4">Contact: {customer.contact}</p>

              <AddOrder customerId={customer.id} />

              {customer.orders.length ? (
                <div className="mt-4">
                  <h3 className="text-md font-semibold mb-2">Customer Orders</h3>
                  <ul className="list-disc list-inside ml-4">
                    {customer.orders.map((order: Order) => {
                      return (
                        <li key={order.id} className="text-sm text-gray-700 mb-1">
                          {order.description} - ${(order.totalInCents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-4">No orders available</p>
              )}
            </div>
          );
        })
        : <p className="text-center text-gray-500">Loading customers...</p>}
      <form
        className="bg-white p-6 rounded shadow-md mt-6 max-w-md mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          createCustomer({
            variables: { name: name, contact: contact },
          });
          if (!error) {
            setName('');
            setContact('');
          }
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Add New Customer</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="contact" className="block text-gray-700 text-sm font-bold mb-2">Contact:</label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => {
              setContact(e.target.value);
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white font-bold py-2 px-4 rounded ${createCustomerLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={createCustomerLoading}
        >
          Add Customer
        </button>
        {createCustomerError ? <p className="mt-4 text-red-500">Error creating customer</p> : null}
      </form>
    </div>
  );
}

export default App;
