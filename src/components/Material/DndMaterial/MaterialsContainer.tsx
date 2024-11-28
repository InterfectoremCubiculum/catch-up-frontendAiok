import { useEffect, useState } from "react";
import { MaterialDto } from "../../../dtos/MaterialDto";
import MaterialItem from "./MaterialItem";
import materialService from "../../../services/materialService";
import { Accordion, Form } from "react-bootstrap";

interface MaterialsContainerProps {
  materialIdToUpdate?: number; 
  state?: number; 
}


const MaterialsContainer: React.FC<MaterialsContainerProps> = ({ materialIdToUpdate, state}) => {
  const [materialList, setMaterialList] = useState<MaterialDto[]>([])
  const [searchedList, setSearchedList] = useState<MaterialDto[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  useEffect ( () => {
    const fetchMaterials = async () => {
      try {
        setMaterialList(await materialService.getAllMaterials())
        setSearchedList(materialList)
      } catch (error) {
        console.error("Error fetching materials:", error)
      }
    }
    fetchMaterials()
  }, [])

  useEffect ( () => {
  }, [materialIdToUpdate,state])

  useEffect ( () => {
    console.log("s")
    const filteredMaterials = () => { 
      setSearchedList(materialList.filter((material) => material.name.toLowerCase().includes(searchTerm.toLowerCase())))
    }
    filteredMaterials()
  }, [searchTerm, materialList])


  return (
    <div>
      <Form.Control
        size="lg"
        className="mb-4"
        type="text"
        placeholder="Search by material name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
    <Accordion className="container-md flex-wrap">
      <hr/>
      <h4>Materials:</h4>
      <hr/>
      {materialList.map((material) => {
        const isVisible = searchedList.find(m => m.id == material.id);
          return (
            <div key={material.id} style={{ display: isVisible ? "block" : "none" }}>
              <MaterialItem
                id={material.id}
                name={material.name}
                files={material.files}
                state={materialIdToUpdate === material.id ? state : 0}
              />
            </div>
          );
        })}
    </Accordion>
    </div>
  )
}
export default MaterialsContainer