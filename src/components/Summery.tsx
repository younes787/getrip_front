import PropTypes from "prop-types";
import { Card } from "primereact/card";

// ----------------------------------------------------------------------

export default function AppWidgetSummary({
  title,
  total,
  icon,
  color = "primary",
  sx,
  ...other
}: any) {
  return (
    <Card className="w-18rem ml-6">
      {icon && <div style={{ width: 64, height: 64 }}>{icon}</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h4
          style={{
            fontSize: "30px",
            height: "0px",
            marginTop: "6px",
            marginBottom: "15px",
          }}
        >
          {total}
        </h4>

        <p style={{ color: "gray" }}>{title}</p>
      </div>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
