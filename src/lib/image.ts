async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  const form = e.currentTarget
  const formData = new FormData(form)

  // 🔒 Validación previa al envío (opcional)
  const file = formData.get("image") as File | null
  if (file) {
    const validTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Formato no permitido (solo JPG, PNG o WEBP).")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande (máx 5 MB).")
      return
    }
  }

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) {
    alert(`Error: ${data.error}`)
    return
  }
}
