import ActivationTable from "./ActivationTable";
import OrderTable from "./OrderTable";
import SectionCard from "./SectionCard";

export default function UsersSection({
  dealerData,
  expandedSections,
  toggleSection,
  dictionary,
}) {
  if (dealerData.User.length === 0) {
    return <p>No users assigned</p>;
  }
  return dealerData.User.map((user, index) => (
    <SectionCard
      key={index}
      expandedSections={expandedSections}
      toggleSection={toggleSection}
      sectionKey={user.name}
      title={user.name + " " + user.email}
      layer={1}
    >
      <div className="mb-6 last:mb-0 p-4 dark:bg-gray-800 rounded-lg text-gray-200">
        <SectionCard
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          sectionKey={user.name + 1}
          title={dictionary.ordersPages.orders}
          layer={2}
        >
          <div className="overflow-x-auto">
            <OrderTable user={user} dictionary={dictionary} />
          </div>
        </SectionCard>

        <SectionCard
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          sectionKey={user.name + 2}
          title={dictionary.activation.activation}
          layer={2}
        >
          <div className="overflow-x-auto">
            <ActivationTable user={user} dictionary={dictionary} />
          </div>
        </SectionCard>
      </div>
    </SectionCard>
  ));
}
