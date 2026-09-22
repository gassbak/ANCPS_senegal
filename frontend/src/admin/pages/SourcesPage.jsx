import SimpleQualityTable from "../components/quality/SimpleQualityTable";

export default function SourcesPage({ session }) {
  return (
    <SimpleQualityTable
      title="Sources"
      description="Sources vérifiables, autorités, références et dates."
      storeKey="sources"
      columns={["name", "authority", "reference", "type", "date"]}
      session={session}
      itemType="source"
    />
  );
}
