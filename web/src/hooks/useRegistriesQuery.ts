// import { useQuery } from "@tanstack/react-query";
// import { Address } from "viem";
// import { graphql } from "src/graphql";
// import { graphqlQueryFnHelper } from "utils/graphqlQueryFnHelper";

// const registriesQuery = graphql(`
//   query Registries($userAddress: Bytes!, $first: Int!, $skip: Int!) {
//     escrows(first: $first, skip: $skip, where: { or: [{ buyer: $userAddress }, { seller: $userAddress }] }) {
//       id
//       buyer
//       seller
//       transactionUri
//       amount
//       asset
//       deadline
//       disputeID
//       buyerFee
//       sellerFee
//       lastFeePaymentTime
//       templateData
//       templateDataMappings
//       status
//       payments {
//         id
//         amount
//         party
//       }
//       hasToPayFees {
//         id
//         party
//       }
//       createdEvents {
//         id
//       }
//       resolvedEvents {
//         id
//         resolution
//       }
//     }
//   }
// `);

// export const useRegistriesQuery = (userAddress: Address, first = 10, skip = 0) => {
//   return useQuery({
//     queryKey: [`registriesQuery`, userAddress, first, skip],
//     queryFn: async () => {
//       try {
//         const data = await graphqlQueryFnHelper(registriesQuery, {
//           userAddress: userAddress.toLowerCase(),
//           first,
//           skip,
//         });
//         return data;
//       } catch (error) {
//         console.error("Error fetching registries:", error);
//         throw new Error("Error fetching registries");
//       }
//     },
//   });
// };
