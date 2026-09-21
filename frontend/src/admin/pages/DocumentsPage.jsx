import SimpleQualityTable from "../components/quality/SimpleQualityTable";

export default function DocumentsPage({ session }) {
  return (
    <SimpleQualityTable
      title="Documents"
      description="Référentiels, décisions, programmes et pièces justificatives."
      storeKey="documents"
      columns={["name", "type", "version", "uploadedAt", "status"]}
      session={session}
      itemType="document"
    />
  );
}
