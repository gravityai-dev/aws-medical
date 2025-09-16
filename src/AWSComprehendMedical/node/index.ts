import { getPlatformDependencies, type EnhancedNodeDefinition } from "@gravityai-dev/plugin-base";
import { AWSComprehendMedicalExecutor } from "./executor";

export const NODE_TYPE = "AWSComprehendMedical";

function createNodeDefinition(): EnhancedNodeDefinition {
  const { NodeInputType } = getPlatformDependencies();
  
  return {
    packageVersion: "1.0.8",
    type: NODE_TYPE,
    name: "AWS Comprehend Medical",
    description: "Extract medical entities, PHI, and insights from clinical text using AWS Comprehend Medical",
    category: "ingest",
    logoUrl: "https://res.cloudinary.com/sonik/image/upload/v1755603269/gravity/icons/ComprehendMedical.png",
    color: "#FF9900",

    inputs: [
      {
        name: "text",
        type: NodeInputType.STRING,
        description: "Clinical text to analyze",
      },
    ],

    outputs: [
      {
        name: "result",
        type: NodeInputType.OBJECT,
        description: "Comprehend Medical analysis results (format based on settings)",
      },
      {
        name: "outputKey",
        type: NodeInputType.STRING,
        description: "S3 key where results were saved (if saveToS3 is enabled)",
      },
    ],

    configSchema: {
      type: "object",
      required: ["text", "analysisType", "outputFormat"],
      properties: {
        text: {
          type: "string",
          title: "Clinical Text",
          description: "The clinical text to analyze",
          default: "",
          "ui:field": "template",
        },
        analysisType: {
          type: "string",
          title: "Analysis Type",
          description: "Type of analysis to perform",
          enum: ["ENTITIES", "PHI", "BOTH"],
          enumNames: ["Medical Entities Only", "PHI Only", "Both Entities and PHI"],
          default: "ENTITIES",
        },
        outputFormat: {
          type: "string",
          title: "Output Format",
          description: "Format of the output data",
          enum: ["json", "simplified", "both"],
          enumNames: ["Raw JSON", "Simplified Structure", "Both"],
          default: "simplified",
        },
        saveToS3: {
          type: "boolean",
          title: "Save to S3",
          description: "Save the analysis results to S3",
          default: false,
        },
        outputPrefix: {
          type: "string",
          title: "S3 Output Prefix",
          description: "Prefix for S3 output files",
          default: "comprehend-medical-output",
          "ui:dependencies": {
            saveToS3: true,
          },
        },
        language: {
          type: "string",
          title: "Language",
          description: "Language of the clinical text",
          enum: ["en"],
          enumNames: ["English"],
          default: "en",
        },
      },
    },

    credentials: [
      {
        name: "awsCredential",
        required: true,
        displayName: "AWS",
        description: "AWS credentials for Comprehend Medical and S3 access",
      },
    ],
  };
}

const definition = createNodeDefinition();

export const AWSComprehendMedicalNode = {
  definition,
  executor: AWSComprehendMedicalExecutor,
};

export { createNodeDefinition };
