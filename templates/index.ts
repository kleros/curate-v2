// WARNING: The Devnet values are hardcoded!
// It needs to be refactored like in the Escrow: https://github.com/kleros/escrow-v2/blob/master/contracts/scripts/setDisputeTemplate.ts

const sharedTemplateProperties = `
  "policyURI": "{{{policyURI}}}",
  "frontendUrl": "https://curate-v2.kleros.builders/#/lists/item/{{itemID}}",
  "arbitrableChainID": "421614",
  "arbitrableAddress": "{{arbitrableAddress}}",
  "arbitratorChainID": "421614",
  "arbitratorAddress": "0x1Bd44c4a4511DbFa7DC1d5BC201635596E7200f9",
  "metadata": {
    "itemName": "{{itemName}}",
    "itemDescription": "{{itemDescription}}",
    "registryTitle": "{{registryTitle}}",
    "registryDescription": "{{registryDescription}}"
  },
  "extraEvidences": [
  {{#requesterEvidence}}
  {{{requesterEvidence}}}
  {{/requesterEvidence}}

  {{#requesterEvidence}}{{#challengerEvidence}},{{/challengerEvidence}}{{/requesterEvidence}}

  {{#challengerEvidence}}
  {{{challengerEvidence}}}
  {{/challengerEvidence}}
  ],
  "category": "Curated Lists",
  "version": "1.0"`;

export const registrationTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Add a {{itemName}} to {{registryTitle}}",
  "description": "Someone requested to add an {{itemName}} to {{registryTitle}}",
  "question": "Does the {{itemName}} comply with the required criteria?",
  "answers": [
    {
      "id":"0x1",
      "title": "Yes, Add It",
      "description": "Select this if you think that the {{itemName}} does comply with the required criteria and should be added."
    },
    {
      "id":"0x2",
      "title": "No, Don't Add It",
      "description": "Select this if you think that the {{itemName}} does not comply with the required criteria and should not be added."
    }
  ], ${sharedTemplateProperties}
}
`;

export const removalTemplate = `{
  "$schema": "../NewDisputeTemplate.schema.json",
  "title": "Remove a {{itemName}} from {{registryTitle}}",
  "description": "Someone requested to remove a {{itemName}} from {{registryTitle}}",
  "question": "Does the {{itemName}} comply with the required criteria?",
  "answers": [
    {
      "id":"0x1",
      "title": "Yes, Remove It",
      "description": "Select this if you think that the {{itemName}} does not comply with the required criteria and should be removed."
    },
    {
      "id":"0x2",
      "title": "No, Don't Remove It",
      "description": "Select this if you think that the {{itemName}} does comply with the required criteria and should not be removed."
    }
  ], ${sharedTemplateProperties}
}
`;

export const dataMappings = `[
  {
    "type": "graphql",
    "endpoint": "https://gateway-arbitrum.network.thegraph.com/api/{{{graphApiKey}}}/subgraphs/id/H93eWJbDpYKAtkLmsMn7Su3ZLZwAwLN5VoyvQH4NbGAv",
    "query": "query SearchRequestByDisputeID($disputeID: BigInt!) { requests(where: { disputeID: $disputeID }) { id disputeID submissionTime resolved requester { id } challenger { id } arbitrator arbitratorExtraData deposit disputeOutcome requestType requesterEvidence challengerEvidence item { id itemID data status registry { id title description policyURI } } } }",
    "variables": {
      "disputeID": "{{arbitratorDisputeID}}"
    },
    "seek": [
      "requests[0].item.registry.title",
      "requests[0].item.registry.description",
      "requests[0].item.registry.policyURI",
      "requests[0].item.id",
      "requests[0].item.data",
      "requests[0].item.status",
      "requests[0].item.registry.id",
      "requests[0].requesterEvidence",
      "requests[0].challengerEvidence"
    ],
    "populate": [
      "registryTitle",
      "registryDescription",
      "policyURI",
      "itemID",
      "itemData",
      "itemStatus",
      "listAddress",
      "requesterEvidence",
      "challengerEvidence"
    ]
  },
  {
    "type": "json",
    "value": "{{{itemData}}}",
    "seek": [
      "columns[0].label",
      "columns[0].description"
    ],
    "populate": [
      "itemName",
      "itemDescription"
    ]
  }
]`;
