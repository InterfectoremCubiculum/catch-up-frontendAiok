import { useEffect, useState } from "react";
import { MaterialDto } from "../../../dtos/MaterialDto";
import MaterialItem from "./MaterialItem";
import materialService from "../../../services/materialService";
import { Accordion, Alert, Button, Form, Modal } from "react-bootstrap";
import Material from "../Material";
import React from "react";
import Loading from "../../Loading/Loading";

interface MaterialsContainerProps {
  materialIdToUpdate?: number
  addedFiles?: number
  onMaterialSelect: (materialId: number, fileIds: number[], action: string) => void
}


const MaterialsContainer: React.FC<MaterialsContainerProps> = ({ materialIdToUpdate, addedFiles, onMaterialSelect }) => {
  const [materialList, setMaterialList] = useState<MaterialDto[]>([])
  const [searchedList, setSearchedList] = useState<MaterialDto[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showMaterial, setShowMaterial] = useState<boolean>(false);

  const [loading, setLoading] = useState(true)

  // Obsługa error-ów
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  
  const fetchMaterials = async () => {
    try {
      setMaterialList(await materialService.getAllMaterials())
    } catch (error) {
      setAlertMessage("Error fetching materials: " +error)
      setShowAlert(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  useEffect(() => {
    const filteredMaterials = () => {
      setSearchedList(materialList.filter((material) => material.name.toLowerCase().includes(searchTerm.toLowerCase())))
    }
    filteredMaterials()
  }, [searchTerm, materialList])

  const materialCreated = (materialId: number) => {
    fetchMaterials()
    setShowMaterial(false)
    return materialId
  }

  const onDeleteItem = async (materialID: number) => {
    try {
      await materialService.deleteMaterial(materialID)
      setMaterialList(materialList.filter((material) => material.id !== materialID));
      onMaterialSelect(materialID, [], "deleteMaterial")
    } catch (error) {
      setAlertMessage("Problem with deleting material: " + error)
      setShowAlert(true)
    }
  }

  return (
    <div className="container-md">
      {showAlert &&(
          <Alert className='alert' variant='danger'>
          {alertMessage}
          </Alert>
      )}
      <Form.Control
        size="lg"
        className="mb-4"
        type="text"
        placeholder="Search by material name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && (
        <div className='mt-3'>
          <Loading/>
        </div>
      )}

      {!loading && (
      <Accordion className="container-md flex-wrap p-0" >
        <hr />
          <h4>Materials:</h4>
          <div className="d-grid gap-2">
            <Button className="mt-3"  variant="secondary" size="lg" onClick={() => setShowMaterial(true)}>Create Material</Button>
          </div>

        <hr />
        {materialList.map((material) => {
          const isVisible = searchedList.find(m => m.id == material.id);
          return (
            <div key={material.id} style={{ display: isVisible ? "block" : "none" }}>
              <MaterialItem
                materialDto={material}
                addedFiles={materialIdToUpdate === material.id ? addedFiles : 0}
                onDeleteItem={onDeleteItem}
                onMaterialSelect={onMaterialSelect}
              />
            </div>
          );
        })}
      </Accordion>
      )}
      
      {showMaterial && (
        <Modal
          onHide={() => setShowMaterial(false)}
          show={showMaterial}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            Create New Material
          </Modal.Header>
          <Modal.Body>
            <Material materialCreated={materialCreated} />
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}
export default MaterialsContainer