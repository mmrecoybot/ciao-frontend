"use client";
import Link from "next/link";
import { useState } from "react";

function Edit() {
  const [formData, setFormData] = useState({
    telefono: "",
    codiceDestinatario: "",
    pec: "",
    emailAmministrativa: "",
    iban: "",
    sitoWeb: "",
    via: "",
    numero: "",
    cap: "",
    comune: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const inputStyles =
    "w-full border rounded-md px-2 py-1.5  transition-all duration-300 focus:border-[#3c8dde] outline-none mt-1";

  const labelStyles = "block text-sm text-[#7D7D7D] font-semibold mt-3";

  return (
    <main className="w-full h-full shadow-lg border-t-2 border-[#3c8dde] overflow-hidden pb-4">
      <header className="shadow-md">
        <h2 className="text-xl font-semibold uppercase text-gray-500 p-3">
          <span className="text-gray-600">partners </span> /
          <span className="text-[#3c8dde]"> partner modification</span>
        </h2>
      </header>

      <section className="p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div>
            <h2 className="font-semibold uppercase text-[#3c8dde] border-b border-[#3c8dde] my-4">
              General records
            </h2>

            <label className={labelStyles}>* Administrative telephone</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>SDI recipient code</label>
            <input
              type="text"
              name="codiceDestinatario"
              value={formData.codiceDestinatario}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>* Pec</label>
            <input
              type="text"
              name="pec"
              value={formData.pec}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>* Administrative email</label>
            <input
              type="email"
              name="emailAmministrativa"
              value={formData.emailAmministrativa}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>IBAN</label>
            <input
              type="text"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              className={inputStyles}
            />

            <h2 className="font-semibold uppercase text-[#3c8dde] border-b border-[#3c8dde] my-4">
              Commercial data
            </h2>
            <label className={labelStyles}>Sito web</label>
            <input
              type="text"
              name="sitoWeb"
              value={formData.sitoWeb}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>

          {/* Right Column */}
          <div>
            <h2 className="font-semibold uppercase text-[#3c8dde] border-b border-[#3c8dde] my-4">
              Billing Address
            </h2>

            <label className={labelStyles}>Go</label>
            <input
              type="text"
              name="via"
              value={formData.via}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>Number</label>
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>CAP</label>
            <input
              type="text"
              name="cap"
              value={formData.cap}
              onChange={handleChange}
              className={inputStyles}
            />

            <label className={labelStyles}>Municipality [Province]</label>
            <input
              type="text"
              name="comune"
              value={formData.comune}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-[#3c8dde] text-white px-4 py-1.5 rounded-md"
            >
              Update Partners
            </button>
            <Link
              href={"/customer/personal-data"}
              className="bg-[#ccc] text-[#333] px-4 py-1.5 rounded-md"
            >
              View
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Edit;
